// frontend/src/components/EmptyState.jsx
function EmptyState({ 
  icon = "📂", 
  title = "Nothing here yet", 
  message = "No data available at the moment." 
}) {
  return (
    <div className="text-center py-12 px-6">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-xs mx-auto">{message}</p>
    </div>
  );
}

export default EmptyState;