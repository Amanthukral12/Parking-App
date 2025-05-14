const PageTransition = ({ children, className = "" }) => {
  return (
    <div
      className={`animate-fadeIn ${className}`}
      style={{
        animationFillMode: "both",
        animationDuration: "0.5s",
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
