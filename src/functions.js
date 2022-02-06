const fetchGraphOneDataFunction = () => fetch('http://coin-oracle.com/api/graphone.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
        body: "authorized"
        })
        .then((response) => response.json())
            .then((json) => {
              return json
            });

const fetchPastPredictions = (type, days) => fetch('http://coin-oracle.com/api/get_past_predictions.php?type=' + type + '&days=' + days, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
        body: "authorized"
        })
        .then((response) => response.json())
            .then((json) => {
              return json
            });

const fetchCurrentPriceOfCoins = (coin_names) => fetch('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + coin_names + '&tsyms=USD', {
        method: 'GET', //e=CCCAGG
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
        })
    .then((response) => response.json())
      .then((json) => {
        return json
      });
const fetchTopTenPredictions = (type) => fetch("http://coin-oracle.com/api/get_predictions.php?type=" + type, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
        })
    .then((response) => response.json())
      .then((json) => {
        return json
      });
const fetchBenchmarck = (coin, limit) => fetch("https://min-api.cryptocompare.com/data/v2/histoday?fsym=" + coin + "&tsym=USD&limit=" + limit, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
        })
    .then((response) => response.json())
      .then((json) => {
        return json
      });


export async function getGraphOneDataFunction() {
	var response = await fetchGraphOneDataFunction()
	var afterResponse = response
  var data = {}
  for (var i=0; i<afterResponse.data.length; i++) {
    data[i] = afterResponse.data[i];
  }
  //console.log("Data: ", data)
	return data;
}

export async function getCurrentPriceOfCoinsFunction(coin_names) {
  var response = await fetchCurrentPriceOfCoins(coin_names);
  return response
}

export async function getTopTenPredictionsFunction(type) {
  var response = await fetchTopTenPredictions(type);
  return response
}

export async function getBenchmarkFunction(coin, limit) {
  var response = await fetchBenchmarck(coin, limit)
  return response
}

export async function getPastPredictionsFunction(type, days) {
  var response = await fetchPastPredictions(type, days)
  return response
}





