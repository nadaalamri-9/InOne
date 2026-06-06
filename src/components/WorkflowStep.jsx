import "./WorkflowStep.css";
function WorkflowStep({ number, icon, title, text, isLast }) {
  return (
    <div className="workflow-step">
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
