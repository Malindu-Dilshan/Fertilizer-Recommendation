function calculateRecommendation() {
    const plantCount = parseInt(document.getElementById('plantCount').value);
    const weekNumber = parseInt(document.getElementById('weekNumber').value);
    
    if (!plantCount || !weekNumber || weekNumber < 1 || weekNumber > 25) {
        alert('Please enter valid values (Week 1-25)');
        return;
    }

    // Determine growth stage
    let stage = '';
    if (weekNumber <= 6) {
        stage = 'Nursery Stage';
    } else if (weekNumber <= 14) {
        stage = 'Growth and Flowering Stage';
    } else {
        stage = 'Harvesting Stage';
    }

    // Calculate Albert solution quantity (increases by 0.2g per week, max 1.5g)
    let albertSolution = Math.min(0.2 + (0.2 * (weekNumber - 1)), 1.5);
    
    // Calculate NPK solution quantities (increases by 0.2g every two weeks, max 1g)
    let npkSolution = Math.min(0.2 + (0.2 * Math.floor((weekNumber - 1) / 2)), 1.0);
    
    // Determine if it's flowering season (after week 6)
    const isFlowering = weekNumber > 6;
    
    // Check if this is a week for NPK application (every 2 weeks)
    const isNPKWeek = weekNumber % 2 === 1;

    // Fixed water quantity at 200ml per plant
    const waterQuantity = 200;
    
    // Convert water quantity from ml to liters and round to whole numbers
    const waterInLiters = Math.round((waterQuantity * plantCount) / 1000);
    
    let weeklySchedule = [
        `<span class="day-label">Day 1:</span> Water ${waterInLiters}L + Albert Solution ${(albertSolution * plantCount).toFixed(1)}g`,
        `<span class="day-label">Day 2:</span> Water ${waterInLiters}L ${isNPKWeek ? `+ 30:10:10 Solution ${(npkSolution * plantCount).toFixed(1)}g` : ''}`,
        `<span class="day-label">Day 3:</span> Water ${waterInLiters}L`,
        `<span class="day-label">Day 4:</span> Water ${waterInLiters}L ${isNPKWeek ? `+ 10:52:10 Solution ${(npkSolution * plantCount).toFixed(1)}g` : ''}`,
        `<span class="day-label">Day 5:</span> Water ${waterInLiters}L + Albert Solution ${(albertSolution * plantCount).toFixed(1)}g`,
        `<span class="day-label">Day 6:</span> Water ${waterInLiters}L + Albert Solution ${(albertSolution * plantCount).toFixed(1)}g`,
        `<span class="day-label">Day 7:</span> Water ${waterInLiters}L`
    ];

    // Add calcium nitrate and K+ solution recommendations for flowering and harvesting stages
    if (isFlowering && weekNumber % 2 === 0) {
        weeklySchedule[0] += ` + Calcium Nitrate ${(0.8 * plantCount).toFixed(1)}g`;
        weeklySchedule[3] += ` + K+ Solution (Spray)`;
    }

    // Add magnesium sulphate recommendation from week 10 onwards
    if (weekNumber >= 10 && weekNumber % 2 === 0) {
        weeklySchedule[2] += ` + Magnesium Sulphate ${(0.8 * plantCount).toFixed(1)}g`;
    }

    // Display results
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2>Week ${weekNumber} Recommendations</h2>
        <div class="stage-info">Current Stage: ${stage}</div>
        ${weeklySchedule.map(day => `<div class="day-recommendation">${day}</div>`).join('')}
        ${getStageSpecificNotes(weekNumber)}
    `;
}

function getStageSpecificNotes(weekNumber) {
    if (weekNumber <= 6) {
        return `
            <div class="stage-notes">
                <h3>Nursery Stage Notes:</h3>
                <ul>
                    <li>Maintain humidity around seedlings</li>
                    <li>Ensure good air circulation to prevent damping off</li>
                    <li>Keep soil consistently moist but not waterlogged</li>
                </ul>
            </div>
        `;
    } else if (weekNumber <= 14) {
        return `
            <div class="stage-notes">
                <h3>Growth and Flowering Stage Notes:</h3>
                <ul>
                    <li>Monitor for pest infestations</li>
                    <li>Ensure proper support for growing plants</li>
                    <li>Maintain consistent moisture levels</li>
                </ul>
            </div>
        `;
    } else {
        return `
            <div class="stage-notes">
                <h3>Harvesting Stage Notes:</h3>
                <ul>
                    <li>Regular harvesting encourages more fruit production</li>
                    <li>Monitor fruit maturity</li>
                    <li>Continue consistent feeding schedule</li>
                </ul>
            </div>
        `;
    }
} 