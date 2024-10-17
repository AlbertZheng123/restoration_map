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

@api_view(['POST'])
def predict_plant_growth(request):
    try:
        data = request.data
        boundaries = data.get('boundaries')
        plants = data.get('plants')
        save = data.get('save', False)
        interpolation = data.get('interpolation', True)
        time = data.get('time', 10)
        epsilon = data.get('epsilon', 1e-2)
        kappa = data.get('kappa', 1)
        D = data.get('D', 1.2)

        # Call the fullmap function to generate the biomass model and save the image
        _, _, image_path = fullmap(boundaries, plants, save, interpolation, time, epsilon, kappa, D)

        # Return the image URL for the frontend to display the overlay
        image_url = f'/media/generated/{os.path.basename(image_path)}'
        
        return Response({
            'overlayImageURL': image_url,  # Return the image URL
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)


# Add squarify and fullmap functions here
def squarify(boundaries, plants):
  maxmin = [boundaries[0][0], boundaries[0][0], boundaries[0][1], boundaries[0][1]]
  for vert in boundaries:
    if vert[0] < maxmin[0]:
      maxmin[0] = vert[0]
    if vert[0] > maxmin[1]:
      maxmin[1] = vert[0]
    if vert[1] < maxmin[2]:
      maxmin[2] = vert[1]
    if vert[1] > maxmin[3]:
      maxmin[3] = vert[1]

  squarelen = max(maxmin[1] - maxmin[0], maxmin[3] - maxmin[2])
  squareboundaries = [(maxmin[0], maxmin[2]), (maxmin[0]+squarelen, maxmin[2]), (maxmin[0], maxmin[2]+squarelen), (maxmin[0]+squarelen, maxmin[2]+squarelen)]

  splits = 100
  coordinates = []
  for plant in plants:
    coordinates.append([math.floor(100*((plant[0] - maxmin[0]) / squarelen)), math.floor(100*((plant[1] - maxmin[2]) / squarelen))])

  inits_blob_A = np.zeros((101,101))
  for i in coordinates:
    inits_blob_A[i[0]+1, i[1]+1] = 1

  return inits_blob_A, squareboundaries

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
    x_vals = np.linspace(-5, 5, 101)
    y_vals = np.linspace(-5, 5, 101)
    xv, yv = np.meshgrid(x_vals, y_vals)
    xv_1D = np.reshape(xv, (101**2, 1))
    yv_1D = np.reshape(yv, (101**2, 1))

    inits1_blob_A, squareboundaries = squarify(boundaries, plants)
    inits1_A = np.zeros((101, 101))
    inits_1_C = np.zeros((101, 101))

    gamma_mod = create_varying_parameter(inits1_A, std_dev=1)
    one_d_out, soln_list = solve_pde((inits1_blob_A, inits_1_C), domain_length=time, epsilon=epsilon, kappa=kappa, D=D, adv=1, rho_0=gamma_mod)

    fig1, ax1 = plt.subplots(1, 1)
    if interpolation:
        ax1.imshow(np.reshape(one_d_out, (101, 101)), origin='lower', aspect='equal', cmap=colormaps['RdYlGn_r'], interpolation='sinc')
    else:
        ax1.imshow(np.reshape(one_d_out, (101, 101)), origin='lower', aspect='equal', cmap=colormaps['RdYlGn_r'])

    if save:
        plt.axis('off')
        # Save the plot in the MEDIA_ROOT directory
        image_path = os.path.join(settings.MEDIA_ROOT, 'generated', 'biomass_model.png')
        os.makedirs(os.path.dirname(image_path), exist_ok=True)
        plt.savefig(image_path, bbox_inches='tight')
        plt.close()

    return np.sum(one_d_out) / (101 * 101), squareboundaries, image_path
