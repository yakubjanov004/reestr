import { Clock3, LifeBuoy, MessageSquareText, PhoneCall, Mail, ChevronRight, HelpCircle } from "lucide-react";
export default function HelpPage() {
  return (
    <section className="page-stack help-page">
      <div className="help-hero-banner">
        <div className="help-hero-content">
          <h1>Sizga qanday yordam bera olamiz?</h1>
          <p>Tizim bilan ishlashda muammo tug'ildimi? Bizning jamoa sizga yordam berishga doim tayyor. O'zingizga qulay aloqa usulini tanlang.</p>
        </div>
        <div className="help-hero-decoration">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
      </div>

      <div className="help-contact-cards">
        <div className="help-card blue-card">
          <div className="help-card-icon">
            <PhoneCall size={24} />
          </div>
          <h3>Telefon orqali</h3>
          <p>Tezkor yordam va to'g'ridan-to'g'ri muloqot uchun qo'ng'iroq qiling.</p>
          <div className="help-card-footer">
            <strong>+998 77 044 40 00</strong>
            <small><Clock3 size={14}/> 09:00 - 18:00 (Du-Ju)</small>
          </div>
        </div>

        <div className="help-card green-card">
          <div className="help-card-icon">
            <MessageSquareText size={24} />
          </div>
          <h3>Telegram orqali</h3>
          <p>Skrinshot va xatoliklar haqida batafsil yozish uchun qulay usul.</p>
          <div className="help-card-footer">
            <strong>@reestr_support</strong>
            <small><Clock3 size={14}/> 24/7 qabul qilinadi</small>
          </div>
        </div>

        <div className="help-card purple-card">
          <div className="help-card-icon">
            <Mail size={24} />
          </div>
          <h3>Elektron pochta</h3>
          <p>Rasmiy murojaatlar va hujjatlar yuborish uchun pochta manzili.</p>
          <div className="help-card-footer">
            <strong>support@reestr.uz</strong>
            <small><Clock3 size={14}/> 1 ish kunida javob</small>
          </div>
        </div>
      </div>

      <div className="help-guide-panel panel">
        <div className="help-guide-head">
          <h2>Murojaat qilish qoidalari</h2>
          <p>Tezroq yordam olish uchun murojaatingizda quyidagilarni ko'rsating:</p>
        </div>
        <div className="help-guide-steps">
          <div className="guide-step">
            <div className="step-number">1</div>
            <div>
              <strong>Muammo qayerda yuz berdi?</strong>
              <p>Qaysi sahifada (masalan: Yuklash oynasi, Statistika) ekanligini ayting.</p>
            </div>
          </div>
          <div className="guide-step">
            <div className="step-number">2</div>
            <div>
              <strong>Qanday harakat qildingiz?</strong>
              <p>Muammo chiqishidan oldin nima tugmani bosganingizni yozing.</p>
            </div>
          </div>
          <div className="guide-step">
            <div className="step-number">3</div>
            <div>
              <strong>Skrinshot ilova qiling</strong>
              <p>Iloji boricha ekranni rasmga olib jo'nating, bu xatoni tez topishga yordam beradi.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
