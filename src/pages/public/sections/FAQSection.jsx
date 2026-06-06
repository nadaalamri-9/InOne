import { useState } from "react";
import "./FAQSection.css";

const faqs = [
  { question:"What is WeCloudData Portfolio?",           answer:"A centralized space for showcasing academic and professional achievements in an organized and professional way." },
  { question:"Is it free for students?",                 answer:"Yes, students can create and maintain their portfolios completely free of charge." },
  { question:"What is the review workflow?",             answer:"After adding your projects, a career coach reviews each one and gives feedback before it goes live." },
  { question:"How do I share my portfolio?",             answer:"You have full control over visibility. Keep it private or publish it publicly so anyone with the link can view it." },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);
  return (
    <section className="faq-section">
      <div className="section-container">
        <div className="faq-header">
          <span>FAQ</span>
          <h2>Frequently asked questions</h2>
        </div>
        <div className="faq-list">
          {faqs.map((f,i) => (
            <div key={i} className={`faq-item ${openIndex===i?"active":""}`} onClick={()=>toggle(i)}
              style={{background:"var(--white)",borderRadius:"var(--radius-lg)",boxShadow:"var(--shadow)",
                padding:"clamp(1rem,1.5vw,1.25rem) clamp(1.25rem,2vw,2rem)",
                display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"1.25rem",cursor:"pointer"}}>
              <div style={{flex:1,minWidth:0}}>
                <h4 style={{color:"var(--text)",fontSize:"clamp(0.875rem,1.1vw,1rem)",fontWeight:600,lineHeight:1.5,margin:0}}>{f.question}</h4>
                {openIndex===i && <p style={{marginTop:"0.75rem",color:"var(--gray)",fontSize:"var(--sm)",lineHeight:1.8}}>{f.answer}</p>}
              </div>
              <span style={{flexShrink:0,color:openIndex===i?"var(--pink)":"var(--purple)",fontSize:"clamp(1.1rem,1.3vw,1.4rem)",fontWeight:700,
                transition:"color 0.3s,transform 0.3s",transform:openIndex===i?"rotate(45deg)":"none",display:"inline-block",marginTop:"2px"}}>+</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default FAQSection;
