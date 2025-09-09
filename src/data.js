export function categorizeData(data, category) {
  function getCode(d) {
    if (!d) return 'N/A';
    return d.alpha3Code || d.cioc || d.alpha2Code || (d.name ? String(d.name).slice(0,3).toUpperCase() : 'N/A');
  }

  function countryMetadata(d) {
    const total_population = (d && d.population) || 0;
    const languages = (d && Array.isArray(d.languages)) ? d.languages.map(l => (l && l.name) || (typeof l === 'string' ? l : undefined)).filter(Boolean) : [];
    const timezones = (d && Array.isArray(d.timezones)) ? d.timezones.slice() : [];
    return { total_population, languages, timezones };
  }

  if (category === "population") {
    return data.map(d => ({
      short_name: getCode(d),
      long_name: (d && d.name) || (d && d.region) || 'N/A',
      value: (d && d.population) || 0,
      metadata: countryMetadata(d)
    }));
  } else if (category === "borders") {
    return data.map(d => ({
      short_name: getCode(d),
      long_name: (d && d.name) || (d && d.region) || 'N/A',
      value: (d && Array.isArray(d.borders)) ? d.borders.length : 0,
      metadata: countryMetadata(d)
    }));
  } else if (category === "timezones") {
    return data.map(d => ({
      short_name: getCode(d),
      long_name: (d && d.name) || (d && d.region) || 'N/A',
      value: (d && Array.isArray(d.timezones)) ? d.timezones.length : 0,
      metadata: countryMetadata(d)
    }));
  } else if (category === "languages") {
    return data.map(d => ({
      short_name: getCode(d),
      long_name: (d && d.name) || (d && d.region) || 'N/A',
      value: (d && Array.isArray(d.languages)) ? d.languages.length : 0,
      metadata: countryMetadata(d)
    }));
  } else if (category === "region_countries") {
    // Group by region and aggregate metadata
    const grouped = new Map();
    data.forEach(d => {
      if (!d) return;
      const region = d.region || 'Unknown';
      if (!grouped.has(region)) grouped.set(region, { count: 0, population: 0, languages: new Set(), timezones: new Set() });
      const g = grouped.get(region);
      g.count += 1;
      g.population += (d.population) || 0;
      if (Array.isArray(d.languages)) d.languages.forEach(l => {
        const name = (l && l.name) || (typeof l === 'string' ? l : undefined);
        if (name) g.languages.add(name);
      });
      const tzs = (d && Array.isArray(d.timezones)) ? d.timezones : [];
      tzs.forEach(tz => { if (tz) g.timezones.add(tz); });
    });
    return Array.from(grouped, ([region, g]) => ({
      short_name: region,
      long_name: region,
      value: g.count,
      metadata: {
        total_population: g.population,
        languages: Array.from(g.languages),
        timezones: Array.from(g.timezones)
      }
    }));
  } else if (category === "region_timezones") {
    // Aggregate per-region unique timezones, plus total population and languages
    const grouped = new Map();
    data.forEach(d => {
      if (!d) return;
      const region = d.region || 'Unknown';
      if (!grouped.has(region)) grouped.set(region, { population: 0, languages: new Set(), timezones: new Set() });
      const g = grouped.get(region);
      g.population += (d.population) || 0;
      if (Array.isArray(d.languages)) d.languages.forEach(l => {
        const name = (l && l.name) || (typeof l === 'string' ? l : undefined);
        if (name) g.languages.add(name);
      });
      const tzs = (d && Array.isArray(d.timezones)) ? d.timezones : [];
      tzs.forEach(tz => { if (tz) g.timezones.add(tz); });
    });
    return Array.from(grouped, ([region, g]) => ({
      short_name: region,
      long_name: region,
      value: g.timezones.size,
      metadata: {
        total_population: g.population,
        languages: Array.from(g.languages),
        timezones: Array.from(g.timezones)
      }
    }));
  }
  return [];
}