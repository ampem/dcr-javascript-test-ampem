import { categorizeData } from '../src/data.js';

// Sample data for testing
const sampleData = [
  {
    name: 'Country A',
    alpha3Code: 'CTA',
    population: 1000000,
    borders: ['CTB', 'CTC'],
    timezones: ['UTC+1', 'UTC+2'],
    languages: [{ name: 'Lang1' }, { name: 'Lang2' }],
    region: 'Europe'
  },
  {
    name: 'Country A2',
    alpha3Code: 'CTA2',
    population: 250000,
    borders: [],
    timezones: ['UTC+1'],
    languages: [{ name: 'Lang5' }],
    region: 'Europe'
  },
  {
    name: 'Country B',
    alpha2Code: 'CB',
    population: 500000,
    borders: [],
    timezones: ['UTC+0'],
    languages: [{ name: 'Lang3' }],
    region: 'Asia'
  }
];

// Additional test data for edge cases
const edgeCaseData = [
  {
    name: 'Country C',
    // Missing alpha3Code, has alpha2Code
    alpha2Code: 'CC',
    population: 0,
    borders: null,
    timezones: [],
    languages: [],
    region: null
  },
  {
    name: 'Country D',
    // Missing all codes
    population: 750000,
    borders: ['CTA'],
    timezones: ['UTC+5'],
    languages: [{ name: 'Lang4' }],
    region: 'Africa'
  },
  {
    // Completely empty object
  },
  null,
  undefined
];

describe('categorizeData', () => {
  test('should categorize by population', () => {
    const result = categorizeData(sampleData, 'population');
    expect(result).toEqual([
      { short_name: 'CTA', long_name: 'Country A', value: 1000000, metadata: { total_population: 1000000, languages: ['Lang1','Lang2'], timezones: ['UTC+1','UTC+2'] } },
      { short_name: 'CTA2', long_name: 'Country A2', value: 250000, metadata: { total_population: 250000, languages: ['Lang5'], timezones: ['UTC+1'] } },
      { short_name: 'COU', long_name: 'Country B', value: 500000, metadata: { total_population: 500000, languages: ['Lang3'], timezones: ['UTC+0'] } }
    ]);
  });

  test('should categorize by borders', () => {
    const result = categorizeData(sampleData, 'borders');
    expect(result).toEqual([
      { short_name: 'CTA', long_name: 'Country A', value: 2, metadata: { total_population: 1000000, languages: ['Lang1','Lang2'], timezones: ['UTC+1','UTC+2'] } },
      { short_name: 'CTA2', long_name: 'Country A2', value: 0, metadata: { total_population: 250000, languages: ['Lang5'], timezones: ['UTC+1'] } },
      { short_name: 'COU', long_name: 'Country B', value: 0, metadata: { total_population: 500000, languages: ['Lang3'], timezones: ['UTC+0'] } }
    ]);
  });

  test('should categorize by timezones', () => {
    const result = categorizeData(sampleData, 'timezones');
    expect(result).toEqual([
      { short_name: 'CTA', long_name: 'Country A', value: 2, metadata: { total_population: 1000000, languages: ['Lang1','Lang2'], timezones: ['UTC+1','UTC+2'] } },
      { short_name: 'CTA2', long_name: 'Country A2', value: 1, metadata: { total_population: 250000, languages: ['Lang5'], timezones: ['UTC+1'] } },
      { short_name: 'COU', long_name: 'Country B', value: 1, metadata: { total_population: 500000, languages: ['Lang3'], timezones: ['UTC+0'] } }
    ]);
  });

  test('should categorize by languages', () => {
    const result = categorizeData(sampleData, 'languages');
    expect(result).toEqual([
      { short_name: 'CTA', long_name: 'Country A', value: 2, metadata: { total_population: 1000000, languages: ['Lang1','Lang2'], timezones: ['UTC+1','UTC+2'] } },
      { short_name: 'CTA2', long_name: 'Country A2', value: 1, metadata: { total_population: 250000, languages: ['Lang5'], timezones: ['UTC+1'] } },
      { short_name: 'COU', long_name: 'Country B', value: 1, metadata: { total_population: 500000, languages: ['Lang3'], timezones: ['UTC+0'] } }
    ]);
  });

  test('should categorize by region_countries', () => {
    const result = categorizeData(sampleData, 'region_countries');
    expect(result).toEqual([
      { short_name: 'Europe', long_name: 'Europe', value: 2, metadata: { total_population: 1250000, languages: ['Lang1','Lang2','Lang5'], timezones: ['UTC+1','UTC+2'] } },
      { short_name: 'Asia', long_name: 'Asia', value: 1, metadata: { total_population: 500000, languages: ['Lang3'], timezones: ['UTC+0'] } }
    ]);
  });

  test('should categorize by region_timezones', () => {
    const result = categorizeData(sampleData, 'region_timezones');
    expect(result).toEqual([
      { short_name: 'Europe', long_name: 'Europe', value: 2, metadata: { total_population: 1250000, languages: ['Lang1','Lang2','Lang5'], timezones: ['UTC+1','UTC+2'] } },
      { short_name: 'Asia', long_name: 'Asia', value: 1, metadata: { total_population: 500000, languages: ['Lang3'], timezones: ['UTC+0'] } }
    ]);
  });

  test('should return empty array for unknown category', () => {
    const result = categorizeData(sampleData, 'unknown');
    expect(result).toEqual([]);
  });

  test('should handle missing data gracefully', () => {
    const result = categorizeData([null, {}], 'population');
    expect(result).toEqual([
      { short_name: 'N/A', long_name: 'N/A', value: 0, metadata: { total_population: 0, languages: [], timezones: [] } },
      { short_name: 'N/A', long_name: 'N/A', value: 0, metadata: { total_population: 0, languages: [], timezones: [] } }
    ]);
  });

  // Enhanced test cases
  test('should handle empty data array', () => {
    const result = categorizeData([], 'population');
    expect(result).toEqual([]);
  });

  test('should handle null and undefined in data array', () => {
    const result = categorizeData([null, undefined], 'population');
    expect(result).toHaveLength(2);
  expect(result.every(item => item.short_name === 'N/A' && item.value === 0)).toBe(true);
  });

  test('should prioritize alpha3Code over alpha2Code', () => {
    const dataWithBothCodes = [{
      name: 'Test',
      alpha2Code: 'AB',
      alpha3Code: 'ABC',
      population: 1000
    }];
    const result = categorizeData(dataWithBothCodes, 'population');
  expect(result[0].short_name).toBe('ABC');
  });

  test('should fallback to name slice when codes are missing', () => {
    const dataWithNameOnly = [{
      name: 'Test Country',
      population: 1000
    }];
    const result = categorizeData(dataWithNameOnly, 'population');
  expect(result[0].short_name).toBe('TES');
  });

  test('should handle short names for code generation', () => {
    const dataWithShortName = [{
      name: 'A',
      population: 1000
    }];
    const result = categorizeData(dataWithShortName, 'population');
  expect(result[0].short_name).toBe('A');
  });

  test('should handle non-array borders gracefully', () => {
    const dataWithInvalidBorders = [{
      name: 'Test',
      borders: 'invalid',
      population: 1000
    }];
    const result = categorizeData(dataWithInvalidBorders, 'borders');
    expect(result[0].value).toBe(0);
  });

  test('should handle non-array timezones gracefully', () => {
    const dataWithInvalidTimezones = [{
      name: 'Test',
      timezones: 'invalid',
      population: 1000
    }];
    const result = categorizeData(dataWithInvalidTimezones, 'timezones');
    expect(result[0].value).toBe(0);
  });

  test('should handle non-array languages gracefully', () => {
    const dataWithInvalidLanguages = [{
      name: 'Test',
      languages: 'invalid',
      population: 1000
    }];
    const result = categorizeData(dataWithInvalidLanguages, 'languages');
    expect(result[0].value).toBe(0);
  });

  test('should handle missing population field', () => {
    const dataWithoutPopulation = [{
      name: 'Test',
      alpha3Code: 'TES'
    }];
    const result = categorizeData(dataWithoutPopulation, 'population');
    expect(result[0].value).toBe(0);
  });

  test('should handle region_countries with missing region', () => {
    const dataWithoutRegion = [{
      name: 'Test',
      population: 1000
    }];
    const result = categorizeData(dataWithoutRegion, 'region_countries');
    expect(result).toEqual([{
         "long_name": "Unknown",
         "metadata": {
           "languages": [],
           "timezones": [],
           "total_population": 1000,
         },
         "short_name": "Unknown",
      value: 1
    }]);
  });

  test('should handle region_timezones with overlapping timezones', () => {
    const dataWithOverlap = [
      { region: 'Test', timezones: ['UTC+1', 'UTC+2'], population: 1000 },
      { region: 'Test', timezones: ['UTC+1', 'UTC+3'], population: 2000 }
    ];
    const result = categorizeData(dataWithOverlap, 'region_timezones');
    const testRegion = result.find(r => r.short_name === 'Test');
    expect(testRegion.value).toBe(3); // UTC+1, UTC+2, UTC+3
  });

  test('should handle region_timezones with invalid timezone arrays', () => {
    const dataWithInvalidTz = [{
      region: 'Test',
      timezones: 'invalid',
      population: 1000
    }];
    const result = categorizeData(dataWithInvalidTz, 'region_timezones');
    const testRegion = result.find(r => r.short_name === 'Test');
    expect(testRegion.value).toBe(0);
  });

  test('should return consistent structure for all categories', () => {
    const categories = ['population', 'borders', 'timezones', 'languages'];
    categories.forEach(category => {
      const result = categorizeData(sampleData, category);
      result.forEach(item => {
  expect(item).toHaveProperty('short_name');
  expect(item).toHaveProperty('long_name');
  expect(item).toHaveProperty('metadata');
  expect(item).toHaveProperty('value');
  expect(typeof item.value).toBe('number');
      });
    });
  });

  test('should handle mixed valid and invalid data', () => {
    const mixedData = [
      { name: 'Valid', alpha3Code: 'VAL', population: 1000 },
      null,
      { name: 'Invalid', population: 'not-a-number' },
      {}
    ];
    const result = categorizeData(mixedData, 'population');
    expect(result).toHaveLength(4);
  expect(result[0].short_name).toBe('VAL');
  expect(result[0].value).toBe(1000);
  expect(result[1].short_name).toBe('N/A');
  expect(result[2].short_name).toBe('INV');
  expect(result[3].short_name).toBe('N/A');
  });
});
