export function categorizeData(data, category) {
  function getCode(d) {
    if (!d) return 'N/A';
    return d.alpha3Code || d.cioc || d.alpha2Code || (d.name ? String(d.name).slice(0,3).toUpperCase() : 'N/A');
  }

  if (category === "population") {
    return data.map(d => ({
      label: getCode(d),
      code: getCode(d),
      value: d.population || 0
    }));
  } else if (category === "borders") {
    return data.map(d => ({
      label: getCode(d),
      code: getCode(d),
      value: Array.isArray(d.borders) ? d.borders.length : 0
    }));
  } else if (category === "timezones") {
    return data.map(d => ({
      label: getCode(d),
      code: getCode(d),
      value: Array.isArray(d.timezones) ? d.timezones.length : 0
    }));
  } else if (category === "languages") {
    return data.map(d => ({
      label: getCode(d),
      code: getCode(d),
      value: Array.isArray(d.languages) ? d.languages.length : 0
    }));
  } else if (category === "region_countries") {
    const grouped = d3.rollup(
      data,
      v => v.length,
      d => d.region
    );
    return Array.from(grouped, ([region, count]) => ({ label: region, code: region, value: count }));
  } else if (category === "region_timezones") {
    const grouped = d3.rollup(
      data,
      v => new Set(v.flatMap(d => Array.isArray(d.timezones) ? d.timezones : [])).size,
      d => d.region
    );
    return Array.from(grouped, ([region, count]) => ({ label: region, code: region, value: count }));
  }
  return [];
}