// ui/ShareClasses.js - Share class breakdown display
// v10.11: PPM-compliant share class tab

window.FundModel = window.FundModel || {};

window.FundModel.ShareClasses = function ShareClasses({ model }) {
  const fmt = function(v) {
    if (v == null || isNaN(v)) return '-';
    const abs = Math.abs(v);
    if (abs >= 1e6) return '$' + (abs / 1e6).toFixed(2) + 'M';
    if (abs >= 1e3) return '$' + (abs / 1e3).toFixed(0) + 'K';
    return '$' + abs.toFixed(0);
  };
  const pct = v => v == null ? '-' : (v * 100).toFixed(2) + '%';
  
  const classes = window.FundModel.SHARE_CLASSES || {};
  const { months } = model;
  if (!months || months.length === 0) return React.createElement('div', null, 'No data');
  
  // Get last post-launch month for summary
  const postLaunch = months.filter(m => !m.isPreLaunch);
  const lastMonth = postLaunch[postLaunch.length - 1] || {};
  
  // Calculate share class breakdown for display
  const classBreakdown = window.FundModel.calculateClassFees
    ? window.FundModel.calculateClassFees(lastMonth)
    : null;
  
  return React.createElement('div', { className: 'space-y-4' },
    // Header card
    React.createElement('div', { className: 'bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200' },
      React.createElement('h2', { className: 'font-bold text-lg text-gray-800 mb-2' }, '📊 Share Class Structure (PPM Compliant)'),
      React.createElement('p', { className: 'text-sm text-gray-600' },
        'GP Commitment → Founder Class (0% fees) | LP Capital → Class A/B/C (1.5% mgmt, 17.5% carry)'
      )
    ),
    
    // Class definitions
    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-4 gap-4' },
      Object.entries(classes).map(([key, cls]) => 
        React.createElement('div', {
          key,
          className: 'bg-white rounded-lg shadow p-4 border-l-4',
          style: { borderLeftColor: cls.color }
        },
          React.createElement('h3', { className: 'font-semibold text-gray-800 mb-2' }, cls.name),
          React.createElement('div', { className: 'space-y-1 text-sm' },
            React.createElement('div', { className: 'flex justify-between' },
              React.createElement('span', { className: 'text-gray-500' }, 'Mgmt Fee'),
              React.createElement('span', { className: 'font-mono' }, pct(cls.mgmtFeeRate))
            ),
            React.createElement('div', { className: 'flex justify-between' },
              React.createElement('span', { className: 'text-gray-500' }, 'Carry'),
              React.createElement('span', { className: 'font-mono' }, pct(cls.carryRate))
            ),
            React.createElement('div', { className: 'flex justify-between' },
              React.createElement('span', { className: 'text-gray-500' }, 'Public Alloc'),
              React.createElement('span', { className: 'font-mono' }, pct(cls.publicWeight))
            ),
            cls.lockupMonths > 0 &&
              React.createElement('div', { className: 'flex justify-between' },
                React.createElement('span', { className: 'text-gray-500' }, 'Lock-up'),
                React.createElement('span', { className: 'font-mono' }, cls.lockupMonths + ' mo')
              ),
            React.createElement('p', { className: 'text-xs text-gray-400 mt-2 italic' }, cls.description)
          )
        )
      )
    ),
    
    // Current allocation breakdown (based on latest month)
    classBreakdown && React.createElement('div', { className: 'bg-white rounded-lg shadow p-4' },
      React.createElement('h3', { className: 'font-semibold mb-3' },
        'Current Allocation (M', lastMonth.month, ' - ', fmt(lastMonth.closingAUM), ' Total AUM)'
      ),
      React.createElement('table', { className: 'w-full text-sm' },
        React.createElement('thead', null,
          React.createElement('tr', { className: 'border-b bg-gray-50' },
            React.createElement('th', { className: 'py-2 px-3 text-left' }, 'Share Class'),
            React.createElement('th', { className: 'py-2 px-3 text-right' }, 'AUM'),
            React.createElement('th', { className: 'py-2 px-3 text-right' }, '% of Total'),
            React.createElement('th', { className: 'py-2 px-3 text-right' }, 'Mgmt Fee Rate'),
            React.createElement('th', { className: 'py-2 px-3 text-right' }, 'Monthly Mgmt Fee'),
            React.createElement('th', { className: 'py-2 px-3 text-right' }, 'Annual Mgmt Fee')
          )
        ),
        React.createElement('tbody', null,
          Object.entries(classes).map(([key, cls]) => {
            const data = classBreakdown[key] || {};
            const pctOfTotal = classBreakdown.totals?.totalAUM > 0
              ? data.aum / classBreakdown.totals.totalAUM : 0;
            return React.createElement('tr', {
              key,
              className: 'border-b ' + (data.aum > 0 ? '' : 'opacity-50')
            },
              React.createElement('td', { className: 'py-2 px-3' },
                React.createElement('span', {
                  className: 'inline-block w-3 h-3 rounded mr-2',
                  style: { backgroundColor: cls.color }
                }),
                cls.name
              ),
              React.createElement('td', { className: 'py-2 px-3 text-right font-mono' }, fmt(data.aum)),
              React.createElement('td', { className: 'py-2 px-3 text-right font-mono' }, pct(pctOfTotal)),
              React.createElement('td', { className: 'py-2 px-3 text-right font-mono' }, pct(cls.mgmtFeeRate)),
              React.createElement('td', { className: 'py-2 px-3 text-right font-mono text-green-600' },
                fmt(data.mgmtFeeMonthly)
              ),
              React.createElement('td', { className: 'py-2 px-3 text-right font-mono text-green-600' },
                fmt(data.mgmtFeeAnnual)
              )
            );
          }),
          React.createElement('tr', { className: 'bg-gray-100 font-semibold' },
            React.createElement('td', { className: 'py-2 px-3' }, 'TOTAL'),
            React.createElement('td', { className: 'py-2 px-3 text-right font-mono' },
              fmt(classBreakdown.totals?.totalAUM)
            ),
            React.createElement('td', { className: 'py-2 px-3 text-right font-mono' }, '100%'),
            React.createElement('td', { className: 'py-2 px-3 text-right font-mono text-blue-600' },
              'Wtd: ' + pct(classBreakdown.totals?.weightedMgmtRate)
            ),
            React.createElement('td', { className: 'py-2 px-3 text-right font-mono text-green-600 font-bold' },
              fmt(classBreakdown.totals?.totalMgmtFeeMonthly)
            ),
            React.createElement('td', { className: 'py-2 px-3 text-right font-mono text-green-600 font-bold' },
              fmt(classBreakdown.totals?.totalMgmtFeeMonthly * 12)
            )
          )
        )
      )
    ),
    
    // Fee impact analysis
    React.createElement('div', { className: 'bg-blue-50 rounded-lg p-4 border border-blue-200' },
      React.createElement('h3', { className: 'font-semibold text-blue-800 mb-2' }, '💡 Fee Impact Analysis'),
      React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-sm' },
        React.createElement('div', null,
          React.createElement('p', { className: 'text-blue-600 font-medium' }, 'GP Commitment Benefit'),
          React.createElement('p', { className: 'text-gray-600' },
            'GP commit (2% of AUM) pays 0% fees, reducing effective fee drag by ~',
            pct(0.02 * 0.015), ' annually'
          )
        ),
        React.createElement('div', null,
          React.createElement('p', { className: 'text-blue-600 font-medium' }, 'Class B Advantage'),
          React.createElement('p', { className: 'text-gray-600' },
            '100% private allocation may yield higher carry potential in illiquid markets'
          )
        ),
        React.createElement('div', null,
          React.createElement('p', { className: 'text-blue-600 font-medium' }, 'Class C Liquidity'),
          React.createElement('p', { className: 'text-gray-600' },
            '100% public with 12mo lockup offers quarterly redemptions (45 days notice)'
          )
        )
      )
    )
  );
};
