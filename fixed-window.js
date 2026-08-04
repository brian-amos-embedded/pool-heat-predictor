// Keep the projection chart on a fixed eight-hour window while preserving the ETA calculation.
calculate = function () {
  save();

  const gallons = +$('gallons').value;
  const area = +$('area').value;
  const heaterBtu = +$('btu').value;
  const efficiency = +$('efficiency').value / 100;
  const currentTemp = +$('currentTemp').value;
  const targetTemp = +$('targetTemp').value;
  const baseline = +$('baseline').value;
  const measuredRate = calibration();
  const mode = $('mode').value;
  const cover = $('cover').value;
  const pump = $('pump').value;

  const physicsRate = heaterBtu * efficiency / (gallons * 8.34);
  let baseRate = mode === 'physics'
    ? physicsRate
    : mode === 'calibrated'
      ? (measuredRate ?? baseline)
      : (measuredRate !== null
        ? 0.65 * measuredRate + 0.35 * physicsRate
        : 0.55 * baseline + 0.45 * physicsRate);

  if (pump === 'low') baseRate *= 0.55;
  if (pump === 'off') baseRate = 0;

  let time = new Date();
  let temperature = currentTemp;
  let eta = null;
  const points = [{ time: new Date(time), temp: temperature }];

  // Exactly 8 hours at 15-minute intervals.
  for (let step = 0; step < 32; step++) {
    const conditions = nearest(time);
    const temperatureDifference = Math.max(0, temperature - conditions.temp);
    const loss = (cover === 'closed' ? 0.00045 : 0.0022)
      * area
      * temperatureDifference
      * (cover === 'closed' ? 1 : 1 + Math.min(2, conditions.wind / 8))
      / 10;
    const evaporation = cover === 'open'
      ? Math.max(0, (70 - conditions.humidity) / 100) * 0.18
      : 0;
    const solarGain = (cover === 'closed' ? 0.03 : 0.16)
      * (1 - conditions.cloud / 100);
    const netRate = Math.max(-0.5, baseRate - loss - evaporation + solarGain);

    temperature += netRate / 4;
    time = new Date(time.getTime() + 15 * 60 * 1000);
    points.push({ time: new Date(time), temp: temperature });

    if (!eta && temperature >= targetTemp) eta = new Date(time);
  }

  // If the target is beyond the visible eight-hour chart, continue only the ETA
  // calculation without adding more graph points.
  if (!eta) {
    for (let step = 0; step < 160; step++) {
      const conditions = nearest(time);
      const temperatureDifference = Math.max(0, temperature - conditions.temp);
      const loss = (cover === 'closed' ? 0.00045 : 0.0022)
        * area
        * temperatureDifference
        * (cover === 'closed' ? 1 : 1 + Math.min(2, conditions.wind / 8))
        / 10;
      const evaporation = cover === 'open'
        ? Math.max(0, (70 - conditions.humidity) / 100) * 0.18
        : 0;
      const solarGain = (cover === 'closed' ? 0.03 : 0.16)
        * (1 - conditions.cloud / 100);
      const netRate = Math.max(-0.5, baseRate - loss - evaporation + solarGain);

      temperature += netRate / 4;
      time = new Date(time.getTime() + 15 * 60 * 1000);
      if (temperature >= targetTemp) {
        eta = new Date(time);
        break;
      }
    }
  }

  const currentConditions = nearest(new Date());
  const currentNetRate = baseRate
    - (cover === 'closed' ? 0.00045 : 0.0022)
      * area
      * Math.max(0, currentTemp - currentConditions.temp)
      / 10;

  $('rateNow').textContent = currentNetRate.toFixed(1) + '°F/hr';
  $('eta').textContent = eta ? clock(eta) : 'Not today';
  $('confidence').textContent = measuredRate !== null
    ? 'High'
    : weather.length
      ? 'Medium'
      : 'Low';

  draw(points, targetTemp);
};

// Recalculate immediately after this override loads.
calculate();
