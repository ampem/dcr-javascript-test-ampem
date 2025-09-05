export function categorizeData(data, category) {
  if (category === "population") {
    return data.map(d => ({
      name: d.name,
      value: d.population || 0
    }));
  } else if (category === "borders") {
    return data.map(d => ({
      name: d.name,
      value: Array.isArray(d.borders) ? d.borders.length : 0
    }));
  } else if (category === "timezones") {
    return data.map(d => ({
      name: d.name,
      value: Array.isArray(d.timezones) ? d.timezones.length : 0
    }));
  } else if (category === "languages") {
    return data.map(d => ({
      name: d.name,
      value: Array.isArray(d.languages) ? d.languages.length : 0
    }));
  } else if (category === "region_countries") {
    const grouped = d3.rollup(
      data,
      v => v.length,
      d => d.region
    );
    return Array.from(grouped, ([region, count]) => ({ name: region, value: count }));
  } else if (category === "region_timezones") {
    const grouped = d3.rollup(
      data,
      v => new Set(v.flatMap(d => Array.isArray(d.timezones) ? d.timezones : [])).size,
      d => d.region
    );
    return Array.from(grouped, ([region, count]) => ({ name: region, value: count }));
  }
  return [];
}