import { useRef, useState } from "react";
import axios from 'axios';

export default function App() {

  const [features, setFeatures] = useState<(string | number)[][]>([[]]);
  const [inputRefs, setInputRefs] = useState<(HTMLInputElement | null)[]>([])
  const [outputData, setOutputData] = useState<(string | number)[]>([])
  const [trainingResult, setTrainingResult] = useState<TrainingResult | undefined>()
  const outputDataInputRef = useRef<HTMLInputElement | null>(null);


  const [prediction, setPrediction] = useState<number | undefined>(undefined)
  const predictionInputRef = useRef<HTMLInputElement | null>(null);

  const returnNumericArrayIfNumeric = (arr: string[]): number[] | string[] => {
    if (arr.every(s => Number.isFinite(Number(s)))) return arr.map(s => Number(s));
    return arr
  }

  const getDisplayableArrayStyleString = (arr: (string | number)[]) => {
    let displayableString = '['
    arr.forEach(item => typeof (item) == 'number' ? displayableString += item.toLocaleString() + ', ' : displayableString += item + ', ')
    displayableString = displayableString.slice(0, displayableString.length - 2);
    displayableString += ']'
    return displayableString
  }

  type TrainingResult = {
    success: boolean
    message: string
    weights: number[]
    biases: number[]
  }

  const trainModel = async () => {
    setTrainingResult(undefined);
    const response = await axios.post('http://localhost:8000/app/train_model', {
      x_features: features,
      output_data: outputData
    })
    const trainingResult: TrainingResult = response.data;
    console.log(trainingResult)
    setTrainingResult(trainingResult);
  }

  const makePrediction = () => {
    if (!trainingResult) return;
    const prediction = Number(predictionInputRef.current?.value) * trainingResult?.weights[0] + trainingResult.biases[0];
    setPrediction(prediction);
  }

  const buttonStyling = "p-1 rounded-2xl px-3 bg-indigo-300 shadow-md shadow-indigo-400"
  const addFeatureButtonStyling = "p-1 px-4 mt-5 py-2 rounded-2xl bg-indigo-300 shadow-md shadow-indigo-400"
  const inputElementStyling = "bg-slate-200 rounded-2xl shadow-md place-self-center w-2/5 text-center"

  return (
    <div className="bg-slate-300 h-full w-full p-10">
      <div className="bg-gray-300 shadow-lg p-10 flex flex-col justify-evenly place-items-center h-full w-2/5 place-self-center rounded-2xl">
        <h1 className="text-6xl text-center">Linear/Logistic Regression Job Creator</h1>
        <p className="italic text-sm mt-5 text-center">Separate your array of integers or strings by commas, any spaces will be autoremoved, single/double quotes are not mandatory for strings and will still be interpreted as such.</p>
        {features.map((feature, i) => (
          <div key={i} className="flex flex-row mt-5 w-full">
            <label className="place-self-center w-1/4">X Feature {i + 1}:</label>
            {feature.length > 0 ?
              <div className="mx-auto">
                <p className="place-self-center">{getDisplayableArrayStyleString(feature)}</p>
              </div>
              :
              <input
                className={inputElementStyling}
                ref={el => {
                  if (!el) return;
                  const next = inputRefs
                  if (next[i]?.value) el.value = next[i]?.value
                  next[i] = el
                  setInputRefs(next)
                }}
              />
            }
            <div className="w-1/4 flex flex-row justify-evenly">
              {feature.length == 0
                ?
                <button className={buttonStyling}
                  onClick={() => {
                    const inputText = inputRefs[i] ? inputRefs[i].value : undefined
                    let rinsedText = inputText?.replace(' ', '').toLowerCase();;
                    let splitText = rinsedText?.split(',');
                    if (!splitText) return;
                    let result = returnNumericArrayIfNumeric(splitText)
                    setFeatures(prev => {
                      const next = [...prev]
                      next[i] = result
                      return next
                    })
                  }}
                >Set Feature</button>
                :
                <>
                  <button className={buttonStyling}
                    onClick={() => {
                      if (!inputRefs[i]) return;
                      setFeatures(prev => {
                        const next = [...prev]
                        next[i] = []
                        return next
                      })
                    }}
                  >Edit</button>
                  <button className={buttonStyling}
                    onClick={() => setFeatures(prev => {
                      const next = [...prev]
                      next.splice(i, 1);
                      const nextInputs = inputRefs
                      nextInputs.splice(i, 1);
                      setInputRefs(nextInputs);
                      return next

                    })}>Delete</button>
                </>
              }
            </div>
          </div>
        ))}
        <button className={addFeatureButtonStyling}
          onClick={() => setFeatures(prev => [...prev, []])}
        >Add New Feature</button>
        <div className="flex flex-row mt-10 w-full">
          <label className="place-self-center w-1/4">Output Data:</label>

          {outputData.length > 0 ?
            <div className="mx-auto">
              <p className="place-self-center">{getDisplayableArrayStyleString(outputData)}</p>
            </div>
            :
            <input
              className={inputElementStyling}
              ref={outputDataInputRef}

            />


          }
          <div className="w-1/4 flex flex-row justify-evenly">

            {outputData.length == 0
              ?
              <button className={buttonStyling}
                onClick={() => {
                  const inputText = outputDataInputRef ? outputDataInputRef.current?.value : undefined
                  let rinsedText = inputText?.replace(' ', '').toLowerCase();;
                  let splitText = rinsedText?.split(',');
                  if (!splitText) return;
                  let result = returnNumericArrayIfNumeric(splitText)
                  setOutputData(result)
                }}
              >Set Output Data</button>
              : <button className={buttonStyling}
                onClick={() => {
                  if (!outputDataInputRef) return;
                  setOutputData([])
                }}
              >Edit</button>
            }
          </div>
        </div>
        <button className={addFeatureButtonStyling}
          onClick={async () => trainModel()}
        >Train Model and Receive Weights & Biases</button>
        {trainingResult &&
          <div className="text-center flex flex-col justify-evenly bg-indigo-200 w-3/4 h-2/5 mt-10 shadow-indigo-300 shadow-xl p-6 rounded-2xl">
            <p className="underline text-4xl">Training Results</p>
            <p>Message: {trainingResult.message}</p>
            <p>Weights: {trainingResult.weights}</p>
            <p>Biases: {trainingResult.biases}</p>
            <div className="flex flex-row justify-evenly">
              <label>Predict a Result:</label>
              <input
                ref={predictionInputRef}
                className={inputElementStyling}
              ></input>
              <button
                className={buttonStyling}
                onClick={() => makePrediction()}
              >Predict</button>
            </div>
            {prediction && <p>Prediction: {prediction}</p>}
          </div>
        }
      </div>
    </div>
  )
}