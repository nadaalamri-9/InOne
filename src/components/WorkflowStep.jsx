import "./WorkflowStep.css";

function WorkflowStep({ number, icon, title, text, isLast, delay = 0 }) {
  return (
    <div
      className="workflow-step"
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="workflow-circle">
        <div className="workflow-badge">{number}</div>
        <img src={icon} alt={title} />
      </div>

      {!isLast && <div className="workflow-line"></div>}

      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default WorkflowStep;