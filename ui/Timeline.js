// ui/Timeline.js - Visual timeline with editable milestones
// v7.1: Gantt-style view synchronized with financial model
// v8.4: Converted to window.FundModel namespace

window.FundModel = window.FundModel || {};

window.FundModel.Timeline = function Timeline({ timeline, onUpdate, assumptions }) {
  const { useState, useMemo } = React;
  const { TIMELINE, getMonthLabel, validateTimeline, getFundLaunchMonth } = window.FundModel;
  const actualTimeline = timeline || TIMELINE || { milestones: [] };
  
  const [editingId, setEditingId] = useState(null);
  const warnings = useMemo(() => validateTimeline ? validateTimeline(actualTimeline) : [], [actualTimeline]);
  const fundLaunchMonth = getFundLaunchMonth ? getFundLaunchMonth(actualTimeline) : 0;
  
  const handleMilestoneChange = (id, field, value) => {
    if (onUpdate) {
      const updated = { ...actualTimeline };
      const idx = updated.milestones.findIndex(m => m.id === id);
      if (idx >= 0) {
        updated.milestones[idx] = { ...updated.milestones[idx], [field]: value };
        onUpdate(updated);
      }
    }
    setEditingId(null);
  };
  
  return (
    <div className="space-y-4">
      {warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Timeline Warnings</h3>
          {warnings.map((w, i) => (
            <p key={i} className={`text-sm ${w.level === 'error' ? 'text-red-600' : 'text-yellow-700'}`}>
              {w.level === 'error' ? '❌' : '⚠️'} {w.message}
            </p>
          ))}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-4">📅 Launch Plan Timeline</h2>
        <div className="relative">
          <div className="absolute left-24 right-4 top-0 h-full">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2" />
            {[1, 6, 12, 18, 24, 30, 36].map(m => (
              <div key={m} className="absolute top-0 bottom-0" style={{ left: `${((m - 1) / 35) * 100}%` }}>
                <div className="absolute bottom-0 transform -translate-x-1/2 text-xs text-gray-400">
                  M{m}<br/><span className="text-[10px]">{getMonthLabel ? getMonthLabel(m, actualTimeline) : ''}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-8 pt-8 pb-16">
            {actualTimeline.milestones.map(milestone => {
              const month = milestone.relativeMonth || (getFundLaunchMonth ? getFundLaunchMonth({ ...actualTimeline, fundLaunchDate: milestone.date }) : 0);
              const position = Math.min(Math.max((month - 1) / 35 * 100, 0), 100);
              const isCritical = milestone.critical;
              const isEditing = editingId === milestone.id;
              
              return (
                <div key={milestone.id} className="relative h-8 flex items-center">
                  <div className="w-24 text-sm text-gray-600 truncate pr-2">{milestone.name}</div>
                  <div className="flex-1 relative">
                    <div 
                      className={`absolute w-4 h-4 rounded-full transform -translate-x-1/2 cursor-pointer transition
                        ${isCritical ? 'bg-red-500 ring-2 ring-red-200' : 'bg-blue-500'}
                        ${milestone.editable ? 'hover:scale-125' : 'opacity-50'}`}
                      style={{ left: `${position}%` }}
                      onClick={() => milestone.editable && setEditingId(milestone.id)}
                    />
                    {isEditing && (
                      <div className="absolute z-10 bg-white shadow-lg rounded p-2 border" style={{ left: `${position}%`, top: '24px' }}>
                        <input
                          type="number"
                          className="w-16 px-2 py-1 border rounded text-sm"
                          defaultValue={month}
                          onBlur={(e) => handleMilestoneChange(milestone.id, 'relativeMonth', parseInt(e.target.value))}
                          autoFocus
                        />
                        <span className="text-xs text-gray-500 ml-1">month</span>
                      </div>
                    )}
                    <div 
                      className="absolute text-xs text-gray-500 transform -translate-x-1/2 mt-5"
                      style={{ left: `${position}%` }}
                    >
                      M{month}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg shadow p-4 border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">🔗 Derived Model Parameters</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><span className="text-gray-600">Fund Launch:</span> <span className="font-mono">Month {fundLaunchMonth}</span></div>
          <div><span className="text-gray-600">BDM Start:</span> <span className="font-mono">Month {assumptions?.bdmStartMonth || 7}</span></div>
          <div><span className="text-gray-600">Lewis Ends:</span> <span className="font-mono">Month {assumptions?.lewisMonths || 12}</span></div>
          <div><span className="text-gray-600">Redemptions:</span> <span className="font-mono">Month {assumptions?.redemptionStartMonth || 25}</span></div>
        </div>
      </div>
    </div>
  );
};
