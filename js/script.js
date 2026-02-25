const formState = {
    currentStep: 1,
    completedSteps: [],
    billing: 'monthly',
    personalInfo: {
        name: '',
        email: '',
        phone: ''
    },
    plan: {
        name: 'arcade',
        monthlyPrice: 9,
        yearlyPrice: 90
    },
    addons: []
};

const planPrices = {
    arcade: { monthly: 9, yearly: 90 },
    advanced: { monthly: 12, yearly: 120 },
    pro: { monthly: 15, yearly: 150 }
}

const addonPrices = {
    'online-service': 1,
    'larger-storage': 2,
    'customizable-profile': 2
}

const addonNames = {
    'online-service': 'Online Service',
    'larger-storage': 'Larger Storage',
    'customizable-profile': 'Customizable Profile'
};

const stepContents = document.querySelectorAll('.step-content');
const stepItems = document.querySelectorAll('.step-item');
const appWrapper = document.querySelector('.app-wrapper');
const billingToggle = document.querySelector('.billing-toggle');
const toggleBtn = document.querySelector('.btn-toggle');

function goToStep(stepNumber) {

    if (!formState.completedSteps.includes(formState.currentStep)) {
        formState.completedSteps.push(formState.currentStep);
    }

    stepContents.forEach(content => { content.hidden = true; });

    document.getElementById(`step-${stepNumber}`).hidden = false;

    stepItems.forEach((item, index) => {
        const stepNum = index + 1;
        item.classList.remove('active');

        if (index + 1 === stepNumber) {
            item.classList.add('active');
        }

        if (formState.completedSteps.includes(stepNum)) {
            item.classList.add('completed');
        }
    });

    if (stepNumber === 4) renderSummary();

    formState.currentStep = stepNumber;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

appWrapper.addEventListener('click', (e) => {
    const btn = e.target.closest('button, a');
    if (!btn) return;

    if (btn.classList.contains('btn-next')) {
        e.preventDefault();
        const valid = validateCurrentStep();
        if (valid) goToStep(formState.currentStep + 1);
    }

    if (btn.classList.contains('btn-go-back')) {
        e.preventDefault();
        goToStep(formState.currentStep - 1);
    }

    if (btn.classList.contains('btn-confirm')) {
        e.preventDefault();
        goToStep(5);
    }

    if (btn.classList.contains('change-link')) {
        e.preventDefault();
        goToStep(2);
    }
});

stepItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        const targetStep = index + 1;
        if (formState.completedSteps.includes(targetStep) || targetStep === formState.currentStep) {
            goToStep(targetStep);
        }
    });
});

toggleBtn.addEventListener('click', () => {
    const isYearly = toggleBtn.getAttribute('aria-checked') === 'true';

    toggleBtn.setAttribute('aria-checked', String(!isYearly));
    formState.billing = isYearly ? 'monthly' : 'yearly';
    billingToggle.classList.toggle('is-yearly');

    document.getElementById('label-monthly').classList.toggle('active', isYearly);
    document.getElementById('label-yearly').classList.toggle('active', !isYearly);

    document.querySelectorAll('.plan-price').forEach(el => {
        const plan = el.closest('.box-card')?.querySelector('input[name="plan"]')?.value;
        if (!plan) return;
        el.textContent = !isYearly
            ? `$${planPrices[plan].yearly}/yr`
            : `$${planPrices[plan].monthly}/mo`;
    });

    document.querySelectorAll('.addons-price').forEach(el => {
        const addon = el.closest('.box-card')?.querySelector('input[name="add-on"]')?.value;
        if (!addon) return;
        el.textContent = !isYearly
            ? `+$${addonPrices[addon] * 10}/yr`
            : `+$${addonPrices[addon]}/mo`;
    });
});

document.querySelectorAll('input[name="plan"]').forEach(radio => {
    radio.addEventListener('change', () => {
        formState.plan = {
            name: radio.value,
            monthlyPrice: planPrices[radio.value].monthly,
            yearlyPrice: planPrices[radio.value].yearly
        };
    });
});

function validateCurrentStep() {
    if (formState.currentStep === 1) return validateStep1();
    if (formState.currentStep === 2) return validateStep2();
    if (formState.currentStep === 3) return validateStep3();
    return true;
};

function validateStep1() {
    const fields = [
        {
            input: document.querySelector('#name'),
            error: document.querySelector('#name-error'),
            rules: [
                { test: value => value.trim() !== '', message: 'Name is required' },
                { test: value => value.trim().length >= 2, message: 'Name must be at least 2 characters' }
            ]
        },
        {
            input: document.querySelector('#email'),
            error: document.querySelector('#email-error'),
            rules: [
                { test: value => value.trim() !== '', message: 'Email is required' },
                { test: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: 'Email is not valid' }
            ]
        },
        {
            input: document.querySelector('#phone'),
            error: document.querySelector('#phone-error'),
            rules: [
                { test: value => value.trim() !== '', message: 'Phone is required' }
            ]
        }
    ];

    let isValid = true;

    fields.forEach(({ input, error, rules }) => {
        clearError(input, error);
        for (let rule of rules) {
            if (!rule.test(input.value)) {
                showError(input, error, rule.message);
                isValid = false;
                break;
            }
        }
    });

    if (isValid) {
        formState.personalInfo = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim()
        };
    }

    return isValid;
}

function validateStep2() {
    const planSelected = document.querySelector('input[name="plan"]:checked');
    if (!planSelected) return false;

    formState.plan = {
        name: planSelected.value,
        monthlyPrice: planPrices[planSelected.value].monthly,
        yearlyPrice: planPrices[planSelected.value].yearly
    };

    return true;
}

function validateStep3() {
    const checked = document.querySelectorAll('input[name="add-on"]:checked');

    formState.addons = Array.from(checked).map(input =>
    ({
        value: input.value,
        name: addonNames[input.value],
        price: addonPrices[input.value]
    }));

    return true;
}

function showError(input, errorEl, message) {
    input.classList.add('input-error');
    errorEl.textContent = message;
}

function clearError(input, errorEl) {
    input.classList.remove('input-error');
    errorEl.textContent = '';
}

['name', 'email', 'phone'].forEach(fieldId => {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}-error`);
    input.addEventListener('input', () => {
        if (input.classList.contains('error')) clearError(input, error);
    });
});

function renderSummary() {
    const isYearly = formState.billing === 'yearly';
    const planPrice = isYearly ? formState.plan.yearlyPrice : formState.plan.monthlyPrice;
    const period = isYearly ? 'yr' : 'mo';
    const periodLabel = isYearly ? 'Yearly' : 'Monthly';

    document.querySelector('.summary-name').textContent = `${formState.plan.name.charAt(0).toUpperCase() + formState.plan.name.slice(1)} (${periodLabel})`;
    document.querySelector('.summary-price').textContent = `$${planPrice}/${period}`;

    const addonsContainer = document.querySelector('.summary-addons-card');
    addonsContainer.innerHTML = '';

    if (formState.addons.length === 0) {
        addonsContainer.innerHTML = `<p class="no-addons">No add-ons selected</p>`;
    } else {
        formState.addons.forEach(addon => {
            const addonPrice = isYearly ? addon.price * 10 : addon.price;   
            addonsContainer.innerHTML += `
        <div class="summary-addons-info">
            <span class="summary-addons-name">${addon.name}</span>
            <span class="summary-addons-price">+$${addonPrice}/${period}</span>
        </div>
      `;
        });
    }


    const addonsTotal = formState.addons.reduce((sum, addon) =>
        sum + (isYearly ? addon.price * 10 : addon.price), 0
    );
    const total = planPrice + addonsTotal;

    document.querySelector('.total-label').textContent =
        `Total (per ${period === 'mo' ? 'month' : 'year'})`;
    document.querySelector('.total-price').textContent =
        `$${total}/${period}`;
}