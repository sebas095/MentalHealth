module.exports = {
  validateName: function(name) {
    return /(?=^.{2,}$)[A-Za-zñÑáÁéÉíÍóÓúÚüÜ ]+/.test(name);
  },
  validateEmail: function(email) {
    return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email);
  },
  validatePhone: function(phone) {
    return /[0-9]+/.test(phone);
  },
  validatePwd: function(pwd) {
    return /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(pwd);
  }
}
