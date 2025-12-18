import { useState } from "react"

export default function App() {

  const [features, setFeatures] = useState<(string | number)[][]>([[]]);
  const [inputRefs, setInputRefs] = useState<(HTMLInputElement | null)[]>([])
  const [outputData, setOutputData] = useState<(string | number)[]>([])
  const [outputDataInputRef, setOutputDataInputRef] = useState<HTMLInputElement | null>(null);

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



  const buttonStyling = "p-1 rounded-2xl px-7 bg-indigo-300 shadow-md shadow-indigo-400"
  const addFeatureButtonStyling = "p-1 px-4 py-2 rounded-2xl bg-indigo-300 shadow-md shadow-indigo-400"

  return (
    <div className="bg-slate-300 h-full w-full p-10">
      <div className="bg-gray-300 shadow-lg p-10 flex flex-col justify-evenly place-items-center h-9/10 w-3/4 place-self-center rounded-2xl">
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
                ref={el => {
                  if (!el) return;
                  const next = inputRefs
                  if (next[i]?.value) el.value = next[i]?.value
                  next[i] = el
                  setInputRefs(next)
                }}
                className="bg-slate-200 rounded-2xl shadow-md place-self-center w-2/5" />
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
        <div className="flex flex-row mt-5 w-full">
          <label className="place-self-center w-1/4">Y Data:</label>

          {outputData.length > 0 ?
            <div className="mx-auto">
              <p className="place-self-center">{getDisplayableArrayStyleString(outputData)}</p>
            </div>
            :
            <input
              ref={el => {
                if (!el) return;
                if (outputDataInputRef) el.value = outputDataInputRef.value
                setOutputDataInputRef(el)
              }
              }
              className="bg-slate-200 rounded-2xl shadow-md place-self-center w-2/5" />


          }
          <div className="w-1/4 flex flex-row justify-evenly">

            {outputData.length == 0
              ?
              <button className={buttonStyling}
                onClick={() => {
                  const inputText = outputDataInputRef ? outputDataInputRef.value : undefined
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
      </div>
    </div>
  )
}