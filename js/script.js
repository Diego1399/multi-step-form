const formState = {
    currentStep: 1,
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

const stepContents = document.querySelectorAll('.step-content');
const stepItems = document.querySelectorAll('.step-item');
const appWrapper = document.querySelector('.app-wrapper');

function showStep(step) {
    stepContents.forEach(content => {
        content.style.display = content.id === `step-${step}` ? 'block' : 'none';
    });
    stepItems.forEach(item => {
        item.classList.toggle('active', item.dataset.step == step);
    });
}

function updatePlanDisplay() {
    const planNameEl = document.querySelector('#step-2 .plan-name');
    const planPriceEl = document.querySelector('#step-2 .plan-price');
    const { name, monthlyPrice, yearlyPrice } = formState.plan;
    planNameEl.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    planPriceEl.textContent = formState.billing === 'monthly' ? `$${monthlyPrice}/mo` : `$${yearlyPrice}/yr`;
}

function goToStep(stepnumber) {
    stepContents.forEach(content => { content.hidden = true; });

    const targetContent = document.querySelector(`#step-${stepnumber}`);
    targetContent.hidden = false;

    stepItems.forEach((item, index) => {
        item.classList.remove('active');
        if (index + 1 === stepnumber) {
            item.classList.add('active');
        }
    });

    formState.currentStep = stepnumber;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

appWrapper.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
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
        alert('Form submitted! Check console for data.');
        console.log('Form Data:', formState);
        goToStep(5);
    }
});

function validateCurrentStep() {
    if (formState.currentStep === 1) return validateStep1();
    return true;
}

function validateStep1() {  
    return true;
    // const nameInput = document.querySelector('#name');   
}
