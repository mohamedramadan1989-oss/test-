const GOOGLE_CLIENT_ID = "915928294273-ps17fmfk5d3f32li3mfoimfas5qh3k12.apps.googleusercontent.com";

function toggleLanguage() {
    const htmlRoot = document.getElementById('htmlRoot');
    const langBtnText = document.getElementById('langText');
    const pageTitle = document.getElementById('pageTitle');
    const headerLogo = document.getElementById('headerLogo');
    const footerLogo = document.getElementById('footerLogo');
    const modalLogoImg = document.getElementById('modalLogoImg');
    const createStoreBtn = document.getElementById('createStoreBtn');
    
    const currentDir = htmlRoot.getAttribute('dir');
    const isCurrentlyAr = (currentDir === 'rtl');

    if (isCurrentlyAr) {
        htmlRoot.setAttribute('dir', 'ltr');
        htmlRoot.setAttribute('lang', 'en');
        if(langBtnText) langBtnText.innerText = 'العربية';
        if(pageTitle) pageTitle.innerText = pageTitle.getAttribute('data-en');
        if(createStoreBtn) createStoreBtn.href = 'create.html';
        if(headerLogo) headerLogo.src = headerLogo.getAttribute('data-en-logo');
        if(footerLogo) footerLogo.src = footerLogo.getAttribute('data-en-logo');
        if(modalLogoImg) modalLogoImg.src = 'Daghta_logo_en.png';
    } else {
        htmlRoot.setAttribute('dir', 'rtl');
        htmlRoot.setAttribute('lang', 'ar');
        if(langBtnText) langBtnText.innerText = 'English';
        if(pageTitle) pageTitle.innerText = pageTitle.getAttribute('data-ar');
        if(createStoreBtn) createStoreBtn.href = 'create_ar.html';
        if(headerLogo) headerLogo.src = headerLogo.getAttribute('data-ar-logo');
        if(footerLogo) footerLogo.src = footerLogo.getAttribute('data-ar-logo');
        if(modalLogoImg) modalLogoImg.src = 'Daghta_ar_white.png';
    }

    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
        el.innerHTML = isCurrentlyAr ? el.getAttribute('data-en') : el.getAttribute('data-ar');
    });

    document.querySelectorAll('[data-ar-placeholder][data-en-placeholder]').forEach(el => {
        el.placeholder = isCurrentlyAr ? el.getAttribute('data-en-placeholder') : el.getAttribute('data-ar-placeholder');
    });
}

let authMode = 'login';

function openAuthModal(mode) {
    authMode = mode;
    const mainBtn = document.getElementById('mainSubmitBtn');
    const forgotBox = document.getElementById('forgotPassBox');
    const switchText = document.getElementById('switchText');
    const switchAction = document.getElementById('switchActionText');
    const mainTitle = document.getElementById('modalMainTitle');
    const subTitle = document.getElementById('modalSubTitle');
    const modalLogo = document.getElementById('modalLogoImg');
    const currentLang = document.getElementById('htmlRoot').getAttribute('dir');
    const isEn = (currentLang === 'ltr');

    if (modalLogo) {
        modalLogo.src = isEn ? 'Daghta_logo_en.png' : 'Daghta_ar_white.png';
    }

    if (authMode === 'login') {
        mainBtn.innerText = isEn ? 'Sign In' : 'تسجيل الدخول';
        forgotBox.style.display = 'block';
        switchText.setAttribute('data-ar', 'ليس لديك حساب؟');
        switchText.setAttribute('data-en', "Don't have an account?");
        switchAction.setAttribute('data-ar', 'سجّل الآن');
        switchAction.setAttribute('data-en', 'Sign up');
        mainTitle.innerText = isEn ? 'Create it. Manage it. Done.' : 'ابحث عنها. أعلن عنها. قدها.';
        subTitle.innerText = isEn ? 'Sign in to explore the leading store platform in the Arab world.' : 'سجّل الدخول لاستكشاف المنصة الرائدة لإنشاء المتاجر في الوطن العربي.';
    } else {
        mainBtn.innerText = isEn ? 'Create Account' : 'إنشاء حساب جديد';
        forgotBox.style.display = 'none';
        switchText.setAttribute('data-ar', 'لديك حساب بالفعل؟');
        switchText.setAttribute('data-en', 'Already have an account?');
        switchAction.setAttribute('data-ar', 'تسجيل الدخول');
        switchAction.setAttribute('data-en', 'Sign in');
        mainTitle.innerText = isEn ? 'Start your business today.' : 'ابني متجرك وابتدي تجارتك.';
        subTitle.innerText = isEn ? 'Create an account and manage your orders instantly.' : 'أنشئ حسابك الآن وتابع أوردراتك وحساباتك بكل سهولة.';
    }
    
    document.getElementById('authModal').style.display = 'flex';
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

function toggleAuthMode() {
    authMode = (authMode === 'login') ? 'register' : 'login';
    openAuthModal(authMode);
}

function togglePasswordVisibility() {
    const passInput = document.getElementById('userPassword');
    const icon = document.getElementById('togglePassword');
    if (passInput.type === 'password') {
        passInput.type = 'text';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    } else {
        passInput.type = 'password';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }
}

function submitAuthForm() {
    const userInput = document.getElementById('userInput').value.trim();
    const userPass = document.getElementById('userPassword').value.trim();
    const currentLang = document.getElementById('htmlRoot').getAttribute('dir');
    
    if (!userInput || !userPass) {
        alert(currentLang === 'ltr' ? 'Please fill in all required fields.' : 'برجاء إدخال البريد الإلكتروني أو الهاتف وكلمة المرور.');
        return;
    }

    localStorage.setItem('daghta_logged_in', 'true');
    localStorage.setItem('daghta_user', userInput);
    window.location.href = 'dashboard.html';
}

// تفعيل تسجيل الدخول الرسمي عبر Google Identity Services
function triggerGoogleRealAuth() {
    if (typeof google === 'undefined' || !google.accounts) {
        alert("Google API is still loading, please try again in a second.");
        return;
    }

    const client = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile openid',
        callback: (response) => {
            if (response.access_token) {
                // جلب بيانات الحساب الأساسية باستخدام الـ Access Token
                fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { 'Authorization': `Bearer ${response.access_token}` }
                })
                .then(res => res.json())
                .then(data => {
                    localStorage.setItem('daghta_logged_in', 'true');
                    localStorage.setItem('daghta_user', data.email || data.name);
                    localStorage.setItem('daghta_auth_provider', 'google');
                    window.location.href = 'dashboard.html';
                })
                .catch(err => {
                    console.error(err);
                    alert("Failed to fetch Google user profile.");
                });
            }
        },
    });

    client.requestAccessToken();
}

const defaultStores = [
    { name: 'متجر حلا للاكسسوارات', logo: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png' },
    { name: 'براند كاجوال ستور', logo: 'https://cdn-icons-png.flaticon.com/512/3050/3050233.png' },
    { name: 'إيليت للعطور والساعات', logo: 'https://cdn-icons-png.flaticon.com/512/2913/2913520.png' },
    { name: 'سنيكرز جراج', logo: 'https://cdn-icons-png.flaticon.com/512/2589/2589901.png' },
    { name: 'فون زون ماركت', logo: 'https://cdn-icons-png.flaticon.com/512/644/644458.png' },
    { name: 'بيوتي كوين هوم', logo: 'https://cdn-icons-png.flaticon.com/512/1005/1005141.png' }
];

function loadStoresTicker() {
    const track = document.getElementById('tickerTrack');
    if (!track) return;
    const savedBrand = localStorage.getItem('daghta_merchant_brand');
    const savedLogo = localStorage.getItem('daghta_merchant_logo');

    let storesList = [...defaultStores];
    if (savedBrand) {
        storesList.unshift({
            name: savedBrand,
            logo: savedLogo || 'https://cdn-icons-png.flaticon.com/512/1160/1160358.png'
        });
    }

    const fullList = [...storesList, ...storesList];
    track.innerHTML = fullList.map(s => `
        <div class="store-card-item">
            <img src="${s.logo}" alt="${s.name}">
            <span>${s.name}</span>
        </div>
    `).join('');
}

function toggleFaq(element) {
    const answer = element.querySelector('.faq-answer');
    const icon = element.querySelector('.faq-question span:last-child');
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        icon.innerText = '➕';
    } else {
        answer.style.display = 'block';
        icon.innerText = '➖';
    }
}

document.addEventListener('DOMContentLoaded', loadStoresTicker);