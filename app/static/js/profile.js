document.addEventListener('DOMContentLoaded', () => {
    // Открытие модалки
    document.querySelectorAll('[data-modal-target]').forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
            }
        });
    });

    // Закрытие модалок
    document.querySelectorAll('.modal').forEach(modal => {
        const closeButtons = modal.querySelectorAll('[data-modal-close]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
            });
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
            }
        });
    });
    // Форматирование номера телефона
    const phoneInput = document.getElementById("update-phone");
    phoneInput.addEventListener("input", () => {
        const raw = phoneInput.value.replace(/\D/g, "");

        const core = raw.replace(/^7|8/, "");
        const digits = core.slice(0, 10);

        phoneInput.value = formatPhone(digits);
    });

    function formatPhone(digits) {
        const parts = [
            digits.slice(0, 3),
            digits.slice(3, 6),
            digits.slice(6, 8),
            digits.slice(8, 10)
        ];

        let result = "+7";

        if (parts[0]) result += ` (${parts[0]}`;
        if (parts[0]?.length === 3) result += `)`;
        if (parts[1]) result += ` ${parts[1]}`;
        if (parts[2]) result += `-${parts[2]}`;
        if (parts[3]) result += `-${parts[3]}`;

        return result;
    }

    const toggleButtons = document.querySelectorAll(".toggle-password");
    toggleButtons.forEach(button => {
        button.addEventListener("click", () => {
            const input = button.previousElementSibling;
            if (input.type === "password") {
                input.type = "text";
                button.querySelector("span").textContent = "visibility_off";
            } else {
                input.type = "password";
                button.querySelector("span").textContent = "visibility";
            }
        });
    });
});
