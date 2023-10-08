document.addEventListener('DOMContentLoaded', function() {
  // References to the password inputs
  const newPasswordInput = document.getElementById('newPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const passwordWarning = document.getElementById('passwordWarning');

  // Function to check if the passwords coincide
  function checkPasswords() {
      if (confirmPasswordInput.value !== "" && confirmPasswordInput.value !== newPasswordInput.value) {
          passwordWarning.style.display = 'block';
      } else {
          passwordWarning.style.display = 'none';
      }
  }

  // Add event listeners to the password inputs to check on typing
  newPasswordInput.addEventListener('input', checkPasswords);
  confirmPasswordInput.addEventListener('input', checkPasswords);
});