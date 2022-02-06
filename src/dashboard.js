import React from 'react'
import ReactDOM from 'react-dom'
import { useState, useEffect, useRef} from 'react';
import './Dashboard.css';
import { Bar, Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'
import { getCurrentPriceOfCoinsFunction, getGraphOneDataFunction, getTopTenPredictionsFunction, getBenchmarkFunction, getPastPredictionsFunction } from './functions.js'


function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}


function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

var predictionData = {"data": []}//{"data": [{"name": "DOGE", "logo": "https://lol", "price": "6.9", "confidence": "99"}, {"name": "LTC", "logo": "https://lol", "price": "0.000001", "confidence": "68"},  {"name": "BTC", "logo": "https://lol", "price": "86700.24", "confidence": "99"},  {"name": "ETH", "logo": "https://lol", "price": "256", "confidence": "80"}]}



async function createPerformanceDataWithTop10() {

	var numberOfPredictionsConsiderd = 10

	var numberOfWeeks = 1
	var numberOfDays = numberOfWeeks*7


	var arrayOfTotalChanges = new Array(numberOfPredictionsConsiderd).fill(0);

	var i;
	for (i=0; i<predictionData.data.length; i++) {
		var requestUrl = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=" + predictionData.data[i].name + "&tsym=USD&limit=" + numberOfDays
		var fetchResponse = await fetch(requestUrl).then(function(response) {
		  return response.json();
		})
		for (var j=0; j<fetchResponse.data.data.length-1; j++) {
		  	arrayOfTotalChanges[i] += (fetchResponse.data.data[i+1]-fetchResponse.data.data[i])
		}
	}
	for (var j=0; j<arrayOfTotalChanges.length; j++) {
		arrayOfTotalChanges[j] = arrayOfTotalChanges[j]/i
	}
}





var colors = ['rgb(20, 99, 132)', 'rgb(255, 99, 132)', 'rgb(33, 33, 120)']

var performanceData = {
	1: [2.6, 5.7, 3.8, -0.5, 6.2, 20.7, -4.4, 2.6, 5.7, 3.8, -0.5, 6.2, 20.7, -4.4, 2.6, 5.7, 3.8, -0.5, 6.2, 20.7, -4.4],
	2: [1.6, -3.7, 5.8, -21.0, 3, 5.7, 0.4, 2.6, 5.7, 3.8, -0.5, 6.2, 20.7, -4.4, 2.6, 5.7, 3.8, -0.5, 6.2, 20.7, -4.4],
	3: [2.6, 3.2, 3.8, 3.5, 12.2, -1.7, -0.5, 2.6, 5.7, 3.8, -0.5, 6.2, 20.7, -4.4, 2.6, 5.7, 3.8, -0.5, 6.2, 20.7, -4.4]
}
var charOneData = {
			charData: {
			  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
			  datasets: [{
			    label: 'One',
			    backgroundColor: 'rgb(255, 99, 132)',
			    borderColor: 'rgb(255, 99, 132)',
			    data: [0, 10, 5, 2, 20, 4],
			  },
			  {
			    label: 'Two',
			    backgroundColor: 'rgb(20, 99, 132)',
			    borderColor: 'rgb(20, 99, 132)',
			    data: [0, 10, 5, 2, 2, 4],
			  }]
			}
		}
var charTwoData = {
			charData: {
			  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
			  datasets: [{
			    label: 'One',
			    backgroundColor: 'rgb(255, 99, 132)',
			    borderColor: 'rgb(255, 99, 132)',
			    data: [0, 10, 5, 2, 20, 4],
			  },
			  {
			    label: 'Two',
			    backgroundColor: 'rgb(20, 99, 132)',
			    borderColor: 'rgb(20, 99, 132)',
			    data: [0, 10, 5, 2, 2, 4],
			  }]
			}
		}

function Dashboard(props) {

	const { height, width } = useWindowDimensions();

	//PREDICTION TABLE
	const [isInDaily, setIsInDaily] = useState(true)
	const [firstTimeInWeekly, setFirstTimeInWeekly] = useState(true)

	const [data, setData] = useState(predictionData)
	const [dataOfOtherType, setDataOfOtherType] = useState()
	const [totalVariation, setTotalVariation] = useState()
	const [otherTotalVariation, setOtherTotalVariation] = useState()
	const [benchmarkData, setBenchmarkData] = useState()
	const [otherBenchmarkData, setOtherBenchmarkData] = useState()

	const [useEffectFirstTime, setUseEffectFirstTime] = useState(true)

	useEffect(async () => {
		if (useEffectFirstTime) {

			//GET TOP 10 WEEKLY PREDICTION
			getTopTenPredictions("daily")
		}
	})



	async function getTopTenPredictions(type) {
			var response_predictions_weekly = await getTopTenPredictionsFunction(type)
			console.log("predictions: ", response_predictions_weekly.predictions)
			var top_ten_predictions = response_predictions_weekly.predictions

			setUseEffectFirstTime(false)
			var arrayOfPredictionNames = []
			for (var i=(top_ten_predictions.length-1); i>=0; i--) {
				arrayOfPredictionNames.push(top_ten_predictions[i].name)
			}
			var stringOfPredictionNames = arrayOfPredictionNames.join()
			var predictionCurrentPrices = await getCurrentPriceOfCoinsFunction(stringOfPredictionNames)

			var tmp_predictions = top_ten_predictions

			var tmp_total_variation = 0
			
			for (var i=0; i<tmp_predictions.length; i++) {
				tmp_predictions[i].price = predictionCurrentPrices[tmp_predictions[i].name]["USD"]
				tmp_predictions[i].confidence = tmp_predictions[i].prediction.toFixed(4)
				tmp_predictions[i].movement = (((predictionCurrentPrices[tmp_predictions[i].name]["USD"]/tmp_predictions[i].price_at_prediction)-1)*100).toFixed(2)
				tmp_total_variation += parseFloat(tmp_predictions[i].movement)
			}
			setData({data: tmp_predictions.reverse()})
			setTotalVariation((tmp_total_variation/10).toFixed(2))
			var benchmark_response_btc;
			var benchmark_response_eth;
			var variaton_btc;
			var variaton_eth;
			if (type == 'daily') {
				benchmark_response_btc = await getBenchmarkFunction('BTC', 1)
				benchmark_response_eth = await getBenchmarkFunction('ETH', 1)
				variaton_btc = (((benchmark_response_btc.Data.Data[1].close/benchmark_response_btc.Data.Data[1].open)-1)*100).toFixed(2)
				variaton_eth = (((benchmark_response_eth.Data.Data[1].close/benchmark_response_eth.Data.Data[1].open)-1)*100).toFixed(2)
			}
			else {
				const d = new Date()
				var limit = (d.getDay() == 0) ? 7 : d.getDay()
				benchmark_response_btc = await getBenchmarkFunction('BTC', limit)
				benchmark_response_eth = await getBenchmarkFunction('ETH', limit)
				variaton_btc = (((benchmark_response_btc.Data.Data[limit].close/benchmark_response_btc.Data.Data[1].open)-1)*100).toFixed(2)
				variaton_eth = (((benchmark_response_eth.Data.Data[limit].close/benchmark_response_eth.Data.Data[1].open)-1)*100).toFixed(2)
				console.log(variaton_btc)
			}
			setBenchmarkData([{name: "BTC", movement: variaton_btc}, {name: "ETH", movement: variaton_eth}])
	}

	function goToWeekly() {
		if (isInDaily) {
			if (firstTimeInWeekly) {
				var tmp_data = data
				var tmp_total_variation = totalVariation
				var tmp_benchmarks = benchmarkData
				getTopTenPredictions("weekly")
				setDataOfOtherType(tmp_data)
				setOtherTotalVariation(tmp_total_variation)
				setOtherBenchmarkData(tmp_benchmarks)
				setFirstTimeInWeekly(false)
			}
			else {
				var tmp_data = data
				var tmp_total_variation = totalVariation
				var tmp_benchmarks = benchmarkData
				setData(dataOfOtherType)
				setTotalVariation(otherTotalVariation)
				setBenchmarkData(otherBenchmarkData)
				setDataOfOtherType(data)
				setOtherTotalVariation(totalVariation)
				setOtherBenchmarkData(benchmarkData)
			}
			setIsInDaily(false)
		}
	}
	function goToDaily() {
		if (!isInDaily) {
			var tmp_data = data
			var tmp_total_variation = totalVariation
			setData(dataOfOtherType)
			setTotalVariation(otherTotalVariation)
			setBenchmarkData(otherBenchmarkData)
			setDataOfOtherType(data)
			setOtherTotalVariation(totalVariation)
			setOtherBenchmarkData(benchmarkData)
			setIsInDaily(true)
		}
	}

	
	//GRAPHS VARIABLES AND FUNCTIONS
	const [isTrue, setIsTrue] = useState(false)
	const [graphTwoIsReady, setGraphTwoIsReady] = useState(false)
	const [runFormatGraphTwo, setRunFormatGraphTwo] = useState(false)
	const [numberOfWeeksGraphTwo, setNumberOfWeeksGraphTwo] = useState(14)
	const [hasLoadedXDays, setHasLoadedXDays] = useState(0)
	var maxNumberOfWeeksGraphTwo =  Math.floor(performanceData[Object.keys(performanceData)[0]].length/7)
	function setNumberOfWeeksGraphTwoFunction(value){if (value <= maxNumberOfWeeksGraphTwo && value >= 1) {setNumberOfWeeksGraphTwo(value); setRunFormatGraphTwo(!runFormatGraphTwo); setChangedPredictionsGraphTwo(!changedPredictionsGraphTwo)}}
	const [changedPredictionsGraphTwo, setChangedPredictionsGraphTwo] = useState(false)

	useEffect(async () => {
		var response = await getGraphOneDataFunction()
		performanceData = response
		formatGraphTwo(numberOfWeeksGraphTwo, 1000)
		setGraphTwoIsReady(true)
	}, [])

	useEffect(() => {
		if (graphTwoIsReady) formatGraphTwo(numberOfWeeksGraphTwo, 1000)
	}, [changedPredictionsGraphTwo, graphTwoIsReady])


	useEffect(() => {
		setRunFormatGraphTwo(!runFormatGraphTwo)
	}, [changedPredictionsGraphTwo])


	async function formatGraphTwo(numberOfDays, initialAmount) {

		if (numberOfDays > hasLoadedXDays) {
			var resonse_past_preds = await getPastPredictionsFunction('daily', numberOfDays)


			var past_predictions_data = new Array(numberOfDays).fill(0)
			for (var i=0; i<resonse_past_preds.predictions.length; i++) {
				past_predictions_data[parseInt(i/10)] += (((resonse_past_preds.predictions[i].price_after/resonse_past_preds.predictions[i].price_at_prediction)-1)*100)
				console.log(((resonse_past_preds.predictions[i].price_after/resonse_past_preds.predictions[i].price_at_prediction)-1)*100)
			}
			for (var i=0; i<past_predictions_data.length; i++) {
				past_predictions_data[i] = past_predictions_data[i]/10
			}
			past_predictions_data = past_predictions_data.reverse()

			var amout_with_predictions = [initialAmount]
			for (var i=0; i<numberOfDays; i++) {
				amout_with_predictions.push(parseFloat((amout_with_predictions[i]*((past_predictions_data[i]/100)+1)).toFixed(4)))
			}

			amout_with_predictions = [1000, 1020, 1008, 1045, 1062, 1120, 1117, 1145, 1120, 1132, 1159, 1127, 1167, 1240, 1250]

			var benchmark_response_btc = await getBenchmarkFunction("BTC", numberOfDays)
			var btc_prices_variations = []
			for (var i=benchmark_response_btc.Data.Data.length-1; i >= 1; i--) {
				btc_prices_variations.unshift(benchmark_response_btc.Data.Data[i].close/benchmark_response_btc.Data.Data[i].open)
			}
			var amount_with_btc = [initialAmount]
			for (var i=0; i<numberOfDays; i++) {
				amount_with_btc.push(parseFloat((amount_with_btc[i]*btc_prices_variations[i]).toFixed(4)))
			}

			charTwoData = {}
			charTwoData.charData = {}
			var tmpDatasetArray = []
			charTwoData.charData.labels = Array.from({length: (numberOfDays+1)}, (_, i) => i + 1)
			var tmpDatasetDictionnary = {label: "Total amount", backgroundColor: colors[0], borderColor: colors[0], data: amout_with_predictions}
			var btcDatasetDictionnary = {label: "BTC", backgroundColor: colors[1], borderColor: colors[1], data: amount_with_btc}

			tmpDatasetArray.push(tmpDatasetDictionnary)
			tmpDatasetArray.push(btcDatasetDictionnary)
			charTwoData.charData.datasets = tmpDatasetArray
		}
	}
	

	return (
		<div className="body">

			<div style={{display: 'flex', justifyContent: 'center'}}>
				<img src="logo.png" style={{width: "75px", height: "75px"}}/>
				<h1 className="appName" style={{margin: 'auto 0px'}}>Coin Oracle</h1>
			</div>
			
			<div>
				<h2 className="title">Predictions</h2>

				<div style={{display: 'flex', justifyContent: 'center'}}>
					<div className="dailyWeeklySwitchDiv">
						<div onClick={() => goToDaily()} className={(isInDaily) ? "typeSwitchOnDiv leftSwitch" : "typeSwitchOffDiv leftSwitch"}>
							<p className={(isInDaily) ? "typeSwitchOnText" : "typeSwitchOffText"}>Daily</p>
						</div>
						<div onClick={() => goToWeekly()} className={(!isInDaily) ? "typeSwitchOnDiv rightSwitch" : "typeSwitchOffDiv rightSwitch"}>
							<p className={(!isInDaily) ? "typeSwitchOnText" : "typeSwitchOffText"}>Weekly</p>
						</div>
					</div>
				</div>

				<p className="lastUpadtedMesasge">{(!isInDaily) ? "Last updated: Monday, 12:01 a.m (UTC)" :  "Last updated: Today 12:01 a.m. (UTC)"}</p>
				<div className="predictionsTable">
					<div className="predictionsTableColumn">
						<div className="predictionColumnTitleDiv">
							<p className="predictionColumnTitleText">Name</p>
						</div>
						<div className="predictionColumnCell">
							{data.data.map((row, index) => <Column data={row} index={index} type="name"/>)}
						</div>
					</div>

					{/*
					<div className="predictionsTableColumn">
						<div className="predictionColumnTitleDiv">
							<p className="predictionColumnTitleText">Logo</p>
						</div>
						<div className="predictionColumnCell">
							{data.data.map((row, index) => <Column data={row} index={index} type="logo"/>)}
						</div>
					</div>
					*/}

					<div className="predictionsTableColumn">
						<div className="predictionColumnTitleDiv">
							<p className="predictionColumnTitleText">Price</p>
						</div>
						<div className="predictionColumnCell">
							{data.data.map((row, index) => <Column data={row} index={index} type="price"/>)}
						</div>
					</div>

					<div className="predictionsTableColumn">
						<div className="predictionColumnTitleDiv">
							<p className="predictionColumnTitleText">Confidence</p>
						</div>
						<div className="predictionColumnCell">
							{data.data.map((row, index) => <Column data={row} index={index} type="confidence"/>)}
						</div>
					</div>

					<div className="predictionsTableColumn">
						<div className="predictionColumnTitleDiv">
							<p className="predictionColumnTitleText">Movement</p>
						</div>
						<div className="predictionColumnCell">
							{data.data.map((row, index) => <Column data={row} index={index} type="movement"/>)}
						</div>
					</div>
				</div>

				<div className="predictionsTable">
					<div className="predictionColumnInnerCell" style={{flex: 0.75}}>
						<p className="predictionColumnTitleText" style={{color: 'white'}}>Average Variation</p>
					</div>
					<div className="predictionColumnInnerCell" style={{flex: 0.25}}>
						<p className="predictionColumnCellText" style={{color: (totalVariation >= 0) ? '#7CFC00': 'red'}}>{(totalVariation != undefined) ? totalVariation + "%" : ""}</p>
					</div>
				</div>

				<div className="predictionsTable">
					<div className="predictionsTableColumn" style={{flex: 0.75}}>
						<div className="predictionColumnTitleDiv">
							<p className="predictionColumnTitleText">Benchmarks</p>
						</div>
						<div className="predictionColumnCell">
							{(benchmarkData != undefined) ? benchmarkData.map((row, index) => <Column data={row} index={index} type="name"/>) : <p></p>}
						</div>
					</div>

					<div className="predictionsTableColumn" style={{flex: 0.25}}>
						<div className="predictionColumnTitleDiv">
							<p className="predictionColumnTitleText">Movement</p>
						</div>
						<div className="predictionColumnCell">
							{(benchmarkData != undefined) ? benchmarkData.map((row, index) => <Column data={row} index={index} type="movement"/>) : <p></p>}
						</div>
					</div>
				</div>


				{
				<div className="graphDiv">
					<h4 className="chartTitle">{"Return on Investment of Hypothetical $10,000 Invested " + numberOfWeeksGraphTwo + " days ago"}</h4>
					<div style={{display: 'flex', flexDirection: 'row', margin: '0 auto'}}>
						
						<div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
							<p style={{color: 'white', margin: 0}}>Weeks: </p>
						</div>
						<NumberInput default={numberOfWeeksGraphTwo} setNumber={setNumberOfWeeksGraphTwoFunction} max={numberOfWeeksGraphTwo}/>
					</div>

					<div>
					{(!runFormatGraphTwo) ?
				        <Line data={charTwoData.charData} options={{
				        	aspectRatio: (width > 600) ? 2 : (width > 500) ? 1.5 : 1.2,
				        	plugins: {
				        		legend: {
				        			labels: {
				        				boxWidth: 10,
				        				boxHeight: 10
				        			}
				        		},
				        		title: {
							        display: true,
							        text: (ctx) => {
							          const {intersect, mode} = ctx.chart.options.interaction;
							          return 'Mode: ' + mode + ', intersect: ' + intersect;
							        }
							      },
				        	},
				        	interaction: {
							      intersect: true,
							      mode: 'index',
							    }
				        }}/>
				        :
				        <Line data={charTwoData.charData}/>
				  }
				  </div>
				</div>
			}

			<p className="bottomNoteText">
				Note on accuracy: Not enough data has been accumulated to give a specific number regarding the accuracy of the model in the “real world” with a good degree of confidence. However, there seems to be a trend, which is that this model seems to pick a fairly large number of very volatile cryptocurrencies. Indeed, its purpose is to find coins that will go up in value as much as possible for a time period (one day or one week), and its strategy seems to be to find very volatile coins, and out of these coins, a few of them will drastically increase in value, while some others will drastically lower in value. More data needs to be accumulated in order to say if the model only chooses very volatile coins and by chance picks cryptocurrencies that go up in value, or if it chooses volatile coins that are more likely to swing up than down.
			</p>

			<p className="bottomNoteText" style={{fontSize: '14px', color: 'grey'}}>
				Disclaimer: This website is not legitimate financial advice! Cryptocurrencies are very volatile and can result in significant loss, so please do your own research!
			</p>

			</div>
		</div>
	)
}


function Column(props) {
	return (
		<div className="predictionColumnInnerCell" style={{backgroundColor: (props.index % 2) ? 'rgba(255,255,255,0.1)' : "rgba(0,0,0,0)"}}>
		{(props.type == "name") ?
			<p className="predictionColumnCellText">{props.data.name}</p>
			:
		(props.type == "price") ?
			<p className="predictionColumnCellText">{"$"+props.data.price}</p>
			:
		(props.type == "confidence") ?
			<p className="predictionColumnCellText">{props.data.confidence+"%"}</p>
			:
			(props.type == "movement") ?
			<p className="predictionColumnCellText" style={{color: (props.data.movement >= 0) ? '#7CFC00': 'red'}}>{props.data.movement+"%"}</p>
			:
			<p className="predictionColumnCellText">logo</p>
		}
		</div>
	)
}

function NumberInput(props) {

	return (
		<div style={{display: 'flex', flexDirection: 'row', marginRight: '5px', marginLeft: '5px'}}>
			<input className="numberInputField" type="text" pattern="[0-9]*" value={props.default} onInput={e => props.setNumber(e.target.value)}/>
			<div style={{flex: 0, flexDirection: 'column', backgroundColor: 'inherit'}}>
				<p onClick={() => props.setNumber(props.default + 1)} className="plusAndMinusButtons plusButton" style={{borderBottom: 'none'}}>+</p>
				<p onClick={() => props.setNumber(props.default - 1)} className="plusAndMinusButtons minusButton">-</p>
			</div>
		</div>

	)
}




export default Dashboard;