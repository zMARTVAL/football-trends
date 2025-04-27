import React from 'react';
import '../Styles/about.css';

const About = () => {
  return (
  
    <section className="features-wrapper">
    <div className="features-title">
    <h2><span className='blue-text'>؟TrendSPORT</span>واش يخدم</h2>
        </div>
  
    <div className="about-features">
      <div className="feature-box">
        <h3>جمع وتحليل البيانات</h3>
        <ul>
          <li>استخراج تويتات، بوستات، مقالات رياضية</li>
          <li>استخراج الكيانات (لاعبين، فرق، بطولات)</li>
          <li>تصفية حسب نوع الرياضة (كرة القدم، باسكات…)</li>
        </ul>
      </div>
      <div className="feature-box">
        <h3>تحليل الترند والمشاعر</h3>
        <ul>
          <li>معرفة أكثر الكلمات و الهاشتاغات استعمالًا</li>
          <li>تحليل الرأي العام (إيجابي؟ سلبي؟ محايد؟)</li>
          <li>التنبؤ بالترندات الجاية باستعمال LLM</li>
        </ul>
      </div>
      <div className="feature-box">
        <h3>واجهة استعمال تفاعلية</h3>
        <ul>
          <li>داشبورد فيه غرافات، فيزواليساسيون، و إحصائيات</li>
          <li>فلتر حسب اللاعب، الفريق، المنافسة</li>
          <li>تحميل تقارير ونتائج التحليل</li>
        </ul>
      </div>
    </div>
  </section>
  
     
   
  );
};

export default About;
