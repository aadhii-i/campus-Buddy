# compute_covariance_numpy.py
import numpy as np

def covariance_matrix(data, ddof=1):
    arr = np.array(data, dtype=float)

    # Compute column means
    means = arr.mean(axis=0)

    # Center the data
    subtracted= arr - means

    n = arr.shape[0]
    cov = (subtracted.T @ subtracted) / (n - ddof)

    return cov

def demo():
    data = [
        [170, 65],
        [165, 60],
        [180, 75],
        [175, 70],
        [160, 55],
    ]

    cov = covariance_matrix(data, ddof=1)
    print("Covariance matrix (height, weight):")
    print(np.round(cov, 3))

def main():
    demo()

if __name__ == "__main__":
    main()
