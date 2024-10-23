# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
import numpy as np
import scipy.sparse as scp
import matplotlib
matplotlib.use('Agg')  # Use a non-GUI backend before importing pyplot
import matplotlib.pyplot as plt
from matplotlib import colormaps  # Adjust this line if you are using a specific version of matplotlib
from scipy.stats import truncnorm
import math
import random
import os
from django.conf import settings


from rest_framework.decorators import api_view
from rest_framework.response import Response
import os
from django.conf import settings  # Ensure fullmap is imported properly

import logging  # For logging errors

# Initialize logger
logger = logging.getLogger(__name__)

@api_view(['POST'])
def predict_plant_growth(request):
    try:
        data = request.data
        
        # Log incoming data for debugging
        logger.info(f"Incoming data: {data}")
        
        # Validate that boundaries and plants (marker locations) are provided
        boundaries = data.get('boundaries')
        plants = data.get('plants')

        if not boundaries or not isinstance(boundaries, list):
            raise ValueError("Boundaries data is missing or invalid")

        if not plants or not isinstance(plants, list):
            raise ValueError("Plant marker locations are missing or invalid")

        # Ensure each plant marker has both latitude and longitude
        for plant in plants:
            if 'latitude' not in plant or 'longitude' not in plant:
                raise ValueError("Each plant marker must have latitude and longitude")

        # Extract additional parameters with default values
        save = data.get('save', False)
        interpolation = data.get('interpolation', True)
        time = data.get('time', 10)
        epsilon = data.get('epsilon', 1e-2)
        kappa = data.get('kappa', 1)
        D = data.get('D', 1.2)

        # Call the fullmap function to generate the biomass model and save the image
        try:
            _, _, image_path = fullmap(boundaries, plants, save, interpolation, time, epsilon, kappa, D)
        except Exception as fullmap_error:
            logger.error(f"Error generating biomass model: {fullmap_error}")
            raise ValueError(f"Failed to generate biomass model: {str(fullmap_error)}")

        # Ensure the image was generated successfully
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Generated image not found: {image_path}")

        # Return the image URL for the frontend to display the overlay
        image_url = f'/media/generated/{os.path.basename(image_path)}'

        logger.info(f"Generated overlay image at: {image_url}")

        return Response({
            'overlayImageURL': image_url,  # Return the image URL
        })

    except ValueError as e:
        logger.error(f"ValueError: {e}")
        return Response({"error": str(e)}, status=400)  # Return 400 for bad input

    except FileNotFoundError as e:
        logger.error(f"FileNotFoundError: {e}")
        return Response({"error": str(e)}, status=404)  # Return 404 if the image is not found

    except Exception as e:
        logger.error(f"Unhandled error: {e}")
        return Response({"error": "Internal Server Error", "details": str(e)}, status=500)



# Add squarify and fullmap functions here
def squarify(boundaries, plants):
    try:
        logger.info(f"squarify called with boundaries: {boundaries} and plants: {plants}")

        # Convert boundaries from dictionary to list format if necessary
        if isinstance(boundaries[0], dict) and 'latitude' in boundaries[0] and 'longitude' in boundaries[0]:
            boundaries = [[b['latitude'], b['longitude']] for b in boundaries]
            logger.info(f"Converted boundaries to list format: {boundaries}")

        if not boundaries or len(boundaries) < 3:
            raise ValueError(f"Invalid boundaries data: {boundaries}")

        maxmin = [boundaries[0][0], boundaries[0][0], boundaries[0][1], boundaries[0][1]]
        logger.info(f"Initial maxmin: {maxmin}")

        # Update maxmin based on boundary vertices
        for vert in boundaries:
            logger.info(f"Processing boundary vertex: {vert}")
            if vert[0] < maxmin[0]:
                maxmin[0] = vert[0]
            if vert[0] > maxmin[1]:
                maxmin[1] = vert[0]
            if vert[1] < maxmin[2]:
                maxmin[2] = vert[1]
            if vert[1] > maxmin[3]:
                maxmin[3] = vert[1]

        logger.info(f"Final maxmin: {maxmin}")

        # Calculate the square that fits the boundaries exactly
        lat_diff = maxmin[1] - maxmin[0]
        lng_diff = maxmin[3] - maxmin[2]

        squarelen = max(lat_diff, lng_diff)
        grid_size = 101  # Keep the grid size the same or modify as needed

        squareboundaries = [
            (maxmin[0], maxmin[2]),
            (maxmin[0] + squarelen, maxmin[2]),
            (maxmin[0], maxmin[2] + squarelen),
            (maxmin[0] + squarelen, maxmin[2] + squarelen)
        ]

        logger.info(f"Square boundaries calculated: {squareboundaries}")

        # Process plants
        coordinates = []
        if not plants or len(plants) == 0:
            logger.warning("No plants provided.")
        else:
            for plant in plants:
                lat = plant['latitude']
                lng = plant['longitude']
                logger.info(f"Processing plant at latitude: {lat}, longitude: {lng}")

                # Calculate plant position within the grid
                x_idx = math.floor(grid_size * ((lat - maxmin[0]) / squarelen))
                y_idx = math.floor(grid_size * ((lng - maxmin[2]) / squarelen))

                # Ensure indices are within bounds
                x_idx = min(max(x_idx, 0), grid_size - 1)
                y_idx = min(max(y_idx, 0), grid_size - 1)

                coordinates.append([x_idx, y_idx])

        inits_blob_A = np.zeros((grid_size, grid_size))

        # Fill the grid with plant data, ensuring indices are in bounds
        for i in coordinates:
            x = min(max(i[0], 0), grid_size - 1)
            y = min(max(i[1], 0), grid_size - 1)
            inits_blob_A[x, y] = 1

        logger.info(f"Blob initialized for plants.")
        return inits_blob_A, squareboundaries

    except Exception as e:
        logger.error(f"Unhandled error in squarify function: {e}")
        raise ValueError(f"Error in squarify: {str(e)}")




def make_matrix_C(delta_x, n_rows, n_cols,D):
    main_diag = (-4/delta_x**2)*np.ones((n_rows,))

    above_diag = np.empty((n_rows-1,))
    above_diag[0] = 2/delta_x**2
    above_diag[1:] = 1/delta_x**2

    below_diag = np.empty((n_rows-1,))
    below_diag[-1] = 2/delta_x**2
    below_diag[:-1] = 1/delta_x**2

    C_mat = D*scp.diags((below_diag, main_diag, above_diag), (-1,0,1))

    # kron products to obtain full matrix
    struct_main_diag = scp.eye(n_cols)
    main_diag_mat = scp.kron(struct_main_diag, C_mat)

    # do the off diagonal matrices
    C_above_below = (D/delta_x**2)*scp.eye(n_rows)
    C_top_bottom = (2*D/delta_x**2)*scp.eye(n_rows)

    # make the structure matrices for these
    above_diag_struct = np.empty(n_cols - 1)
    above_diag_struct[0] = 0
    above_diag_struct[1:] = 1
    below_diag_struct = np.empty(n_cols -1)
    below_diag_struct[-1] = 0
    below_diag_struct[:-1] = 1
    C_off_diag_struct = scp.diags((below_diag_struct, above_diag_struct),(-1,1))

    # top_bottom matrix
    top_struct = np.zeros(n_cols -1)
    top_struct[0] = 1
    bottom_struct = np.zeros(n_cols -1)
    bottom_struct[-1] = 1
    C_top_bottom_struct = scp.diags((top_struct, bottom_struct), (1,-1))

    # combine for full structure matrix for off diagonals
    mat_off_diags = scp.kron(C_off_diag_struct, C_above_below) + scp.kron(C_top_bottom_struct, C_top_bottom)

    # combine for full C matrix
    C_mat = main_diag_mat + mat_off_diags
    return C_mat

def make_matrix_C_advection(delta_x, n_rows, n_cols, D, adv):
    main_diag = (-4/delta_x**2)*np.ones((n_rows,))
    main_diag[1:-1] += -adv/delta_x

    above_diag = np.empty((n_rows-1,))
    above_diag[0] = 2/delta_x**2
    above_diag[1:] = 1/delta_x**2

    below_diag = np.empty((n_rows-1,))
    below_diag[-1] = 2/delta_x**2
    below_diag[:-1] = 1/delta_x**2 + adv/delta_x

    C_mat = D*scp.diags((below_diag, main_diag, above_diag), (-1,0,1))

    # kron products to obtain full matrix
    struct_main_diag = scp.eye(n_cols)
    main_diag_mat = scp.kron(struct_main_diag, C_mat)

    # do the off diagonal matrices
    C_above_below = (D/delta_x**2)*scp.eye(n_rows)
    C_top_bottom = (2*D/delta_x**2)*scp.eye(n_rows)

    # make the structure matrices for these
    above_diag_struct = np.empty(n_cols - 1)
    above_diag_struct[0] = 0
    above_diag_struct[1:] = 1
    below_diag_struct = np.empty(n_cols -1)
    below_diag_struct[-1] = 0
    below_diag_struct[:-1] = 1
    C_off_diag_struct = scp.diags((below_diag_struct, above_diag_struct),(-1,1))

    # top_bottom matrix
    top_struct = np.zeros(n_cols -1)
    top_struct[0] = 1
    bottom_struct = np.zeros(n_cols -1)
    bottom_struct[-1] = 1
    C_top_bottom_struct = scp.diags((top_struct, bottom_struct), (1,-1))

    # combine for full structure matrix for off diagonals
    mat_off_diags = scp.kron(C_off_diag_struct, C_above_below) + scp.kron(C_top_bottom_struct, C_top_bottom)

    # combine for full C matrix
    C_mat = main_diag_mat + mat_off_diags
    return C_mat



# timestepping function for C
def timestep_C(A_vector, C_vector, delta_t, C_mat, gamma, beta):
    C_t_plus = C_vector + delta_t*(C_mat*C_vector - C_vector + gamma*A_vector**2/(beta**2 + A_vector**2))
    return C_t_plus

# timestepper for A
def timestep_A(A_vector, C_vector, delta_t, epsilon, rho_0, kappa):
    A_t_plus = A_vector + delta_t*(epsilon*C_vector + rho_0*A_vector - kappa*A_vector**2)
    return A_t_plus

# solve and plotter for output
def solve_pde(inits, n_time_points = 10000, domain_length = 10, delta_t = 1e-3, D = 1, gamma = 1, beta = 1, epsilon = 1e-2, rho_0 = 1.2, kappa = 1, adv = 0):

    # set delta_x
    n_rows = len(inits[0][:,0])
    n_cols = len(inits[0][0,:])
    delta_x = domain_length/(n_rows - 1)

    # create C matrix
    if adv != 0:
        C_mat = make_matrix_C_advection(delta_x, n_rows, n_cols, D, adv)
    else:
        C_mat = make_matrix_C(delta_x, n_rows, n_cols, D)

    # lambda-ize A and C functions
    lambda_timestepper = lambda x: (timestep_A(x[0],x[1], delta_t, epsilon, rho_0, kappa), timestep_C(x[0],x[1], delta_t, C_mat, gamma, beta))

    # start the loop
    cur_soln = [np.reshape(x, (n_rows*n_cols, 1)) for x in inits]
    soln_list = [cur_soln]
    for time_count in range(n_time_points):
        cur_soln = lambda_timestepper(cur_soln)
        soln_list += [cur_soln]


    plot_array_A = soln_list[-1][0]

    return np.reshape(plot_array_A,(n_rows*n_cols,1)), soln_list

def create_varying_parameter(inits, mean = 1, std_dev = 0.1):
    a, b = (0.1 - mean) / std_dev, (1.9 - mean) / std_dev
    non_smoothed_noise = truncnorm.rvs(a,b,loc = mean, scale = std_dev, size = (inits.shape[0] + 2, inits.shape[1] +2))
    out = np.empty_like(non_smoothed_noise)
    for i in range(1,inits.shape[0]+1):
        for j in range(1, inits.shape[1]+1):
            out[i,j] = 0.1+np.mean(non_smoothed_noise[i-1:i+2,j-1:j+2])
    out = out[1:-1,1:-1]
    return np.reshape(out,(out.shape[0]*out.shape[1],1))

def fullmap(boundaries, plants, save, interpolation, time, epsilon, kappa, D):
    try:
        # Perform squarify and catch any errors
        try:
            inits1_blob_A, squareboundaries = squarify(boundaries, plants)
        except Exception as e:
            logger.error(f"Error in squarify function: {e}")
            raise ValueError(f"Error in squarify: {e}")

        # Get the square boundaries to fit the polygon
        lat_min, lng_min = squareboundaries[0]
        lat_max, lng_max = squareboundaries[3]

        # Adjust the meshgrid to match the exact boundaries
        grid_size = inits1_blob_A.shape[0]  # Use the size from squarify

        x_vals = np.linspace(lat_min, lat_max, grid_size)
        y_vals = np.linspace(lng_min, lng_max, grid_size)
        xv, yv = np.meshgrid(x_vals, y_vals)
        xv_1D = np.reshape(xv, (grid_size**2, 1))
        yv_1D = np.reshape(yv, (grid_size**2, 1))

        # Create varying parameter
        inits1_A = np.zeros((grid_size, grid_size))
        inits_1_C = np.zeros((grid_size, grid_size))
        gamma_mod = create_varying_parameter(inits1_A, std_dev=1)

        # Solve the PDE
        try:
            one_d_out, soln_list = solve_pde(
                (inits1_blob_A, inits_1_C),
                domain_length=time,
                epsilon=epsilon,
                kappa=kappa,
                D=D,
                adv=1,
                rho_0=gamma_mod
            )
        except Exception as e:
            logger.error(f"Error solving PDE: {e}")
            raise ValueError(f"Error solving PDE: {e}")

        # Plot the biomass model
        fig1, ax1 = plt.subplots(1, 1)
        try:
            if interpolation:
                ax1.imshow(np.reshape(one_d_out, (grid_size, grid_size)), origin='lower', aspect='equal', cmap=colormaps['RdYlGn_r'], interpolation='sinc')
            else:
                ax1.imshow(np.reshape(one_d_out, (grid_size, grid_size)), origin='lower', aspect='equal', cmap=colormaps['RdYlGn_r'])
        except Exception as e:
            logger.error(f"Error in plotting: {e}")
            raise ValueError(f"Error in plotting: {e}")

        # Save the image if required and ensure image_path is set
        if save:
            try:
                plt.axis('off')
                image_path = os.path.join(settings.MEDIA_ROOT, 'generated', 'biomass_model.png')
                os.makedirs(os.path.dirname(image_path), exist_ok=True)
                plt.savefig(image_path, bbox_inches='tight')
                plt.close()
            except Exception as e:
                logger.error(f"Error saving image: {e}")
                raise ValueError(f"Error saving image: {e}")
        else:
            logger.warning("Image was not saved because 'save' was False or image save failed.")

        # Return the results
        return np.sum(one_d_out) / (grid_size**2), squareboundaries, image_path

    except Exception as e:
        logger.error(f"Unhandled error in fullmap function: {e}")
        raise ValueError(f"Error in fullmap: {e}")
