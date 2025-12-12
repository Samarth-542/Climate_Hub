export const aiService = {
  generateSummary: async (incidents) => {
    // Simulate network delay for realism
    await new Promise(r => setTimeout(r, 1500));

    if (!incidents || incidents.length === 0) {
      return "No incidents reported in the monitored period. Environmental conditions appear stable.";
    }

    // Simple analysis for mock AI
    const types = incidents.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {});

    const sortedTypes = Object.entries(types).sort((a, b) => b[1] - a[1]);
    const topType = sortedTypes[0];
    const total = incidents.length;

    // Construct a "Likely AI" response
    return `### **Climate Incident Summary**
    
**Overview**
A total of **${total} climate incidents** have been reported in the selected period. The data indicates a significant prevalence of **${topType[0]}** events, accounting for most reports.

**Key Observations**
- **Primary Concern**: ${topType[0]} (${topType[1]} reports)
- **Pattern Analysis**: Reports are concentrated in affected urban zones. Immediate attention is recommended for these sectors.
- **Trend**: ${total > 3 ? "High activity detected." : "Moderate activity levels."}

**Recommendations**
Monitor local weather alerts and deploy resources to high-frequency zones.`;
  }
};
