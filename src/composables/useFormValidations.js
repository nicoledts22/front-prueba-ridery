import { computed, watchEffect } from 'vue';

export function useFormValidations({
    email,
    emailTouched,
    password,
    passwordTouched,
    name,
    nameTouched,
    lastname,
    lastnameTouched,
    passwordConfirm,
    passwordConfirmTouched,
    view
}) {

    const emailValidation = computed(() => {
        if (!emailTouched.value) return '';
        if (!email.value) return 'El correo es obligatorio.';
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.value)) return 'Correo inválido.';
        return '';
    });

    const passwordValidation = computed(() => {
        if (!passwordTouched?.value) return '';
        if (!password?.value) return 'La contraseña es obligatoria.';
        if (password.value.length < 8) return 'Debe tener al menos 8 caracteres.';
        return '';
    });

    const nameValidation = computed(() => {
        if (view !== 'Registro') return '';
        if (!nameTouched?.value) return '';
        if (!name?.value) return 'El nombre es obligatorio.';
        if (name.value.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
        return '';
    });

    const lastnameValidation = computed(() => {
        if (view !== 'Registro') return '';
        if (!lastnameTouched?.value) return '';
        if (!lastname?.value) return 'El apellido es obligatorio.';
        if (lastname.value.length < 3) return 'El apellido debe tener al menos 3 caracteres.';
        return '';
    });

    const passwordConfirmValidation = computed(() => {
        if (view !== 'Registro') return '';
        if (!passwordConfirmTouched?.value) return '';
        if (!passwordConfirm?.value) return 'Debe confirmar su contraseña.';
        if (passwordConfirm.value !== password.value) return 'Las contraseñas no coinciden.';
        return '';
    });

    // Auto-activar la validación en tiempo real después de que el campo ha sido tocado
    watchEffect(() => {
        if (email?.value) emailTouched.value = true;
        if (password?.value) passwordTouched.value = true;
        if (name && name.value) nameTouched.value = true;
        if (lastname && lastname.value) lastnameTouched.value = true;
        if (passwordConfirm && passwordConfirm.value) passwordConfirmTouched.value = true;
    });

    const isFormValid = computed(() => {
        if (view === 'Login') {
            return emailTouched.value && passwordTouched.value &&
                !emailValidation.value && !passwordValidation.value;
        } else if (view === 'Registro') {
            return nameTouched.value && lastnameTouched.value && emailTouched.value &&
                passwordTouched.value && passwordConfirmTouched.value &&
                !nameValidation.value && !lastnameValidation.value &&
                !emailValidation.value && !passwordValidation.value &&
                !passwordConfirmValidation.value;
        } else if (view === 'OlvidoContrasena') {
            return emailTouched.value && !emailValidation.value;
        }
        return false;
    });

    return {
        emailValidation,
        passwordValidation,
        nameValidation,
        lastnameValidation,
        passwordConfirmValidation,
        isFormValid,
    };
}





