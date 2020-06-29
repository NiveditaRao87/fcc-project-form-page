//Form validations are done, no backend, data is not sent to server
// Adding line breaks to radio buttons and checkbox using javascript. This is of course unnecessary and 
// better done manually in HTML, I'm only trying to practice.

function addBr(type) {
    let inputs = document.querySelectorAll(`input[type=${type}]`)    
    for(let input of inputs) {
        //  Declaring this outside the for loop creates only one br element which then gets shifted around 
        //    at each iteration. Wasted 1 hour on this. 
        let br = document.createElement("br")
        let id = input.id
        let label = document.querySelector(`label[for=${id}]`)
        if(!label) return
        // console.log(label.insertAdjacentHTML("afterend","<br>"));
         label.insertAdjacentElement("afterend",br)
         
    }
    
}
// show other linked input textbox only when other is selected
toggleOther = (event,checked) => {
   const {name,value,type} = event.target
   
    value.startsWith("other") ?
        (type !== "checkbox" || type === "checkbox" && checked)  
        ? document.querySelector(`#${value}`).setAttribute("style","display: block") 
        : document.querySelector(`#other-${name}`).setAttribute("style","display: none") 
        : document.querySelector(`#other-${name}`).setAttribute("style","display: none") 
}

setEffects = (check) => {
   // Check or uncheck all effect boxes based if all of the above or none of the above is checked
    for(let effect of document.querySelectorAll("input[name='effect']")){
        if(effect.value === "none"){
            continue
        }
        effect.checked = check        
    }
}

showProgress = () => {
    let filledInputs = {
        radios: [],
        checkboxes: [],
        otherInputs: 0,
        selects: 0,
        textAreas: 0
    }
    for(let input of document.querySelectorAll("input")){
        //At least one radio button in each category
        input.type === "radio" ? input.checked && !filledInputs.radios.includes(input.name) && filledInputs.radios.push(input.name)
        // At least one checkbox in each category or if other is selected then the corressponding text field
        :input.type === "checkbox" ? (input.value.startsWith("other") && 
        document.querySelector(`#${input.value}`).value !== "") || !input.value.startsWith("other") && 
        input.checked && !filledInputs.checkboxes.includes(input.name) && filledInputs.checkboxes.push(input.name)  
        // All input fields that are not other apart from checkbox and radio
        : input.validity.valid  && !input.id.startsWith("other") && input.value !== "" && filledInputs.otherInputs++
   }
// Check to see if select is filled and if other is chosen , correspnding text box is filled
    let select = document.querySelector("#dropdown")
    select.value !== "select" && !select.value.startsWith("other") ?
    filledInputs.selects++ : select.value.startsWith("other") && document.querySelector(`#${select.value}`).value !== ""
    && filledInputs.selects++

//  Since only one textarea not iterating

    document.querySelector("textarea").value !== "" && filledInputs.textAreas++

    let total = 0
    for(let value of Object.values(filledInputs)){
        Array.isArray(value) ? total += value.length : total += value
    }
    
    //Update text of progress bar and also the actual value
    let progress = document.querySelector("progress")
    progress.value = total
    
    let progressText = progress.closest("div").lastElementChild
    
    let progressArray = progressText.textContent.split("of")

    progressArray[0] = `${total} of`

    progressText.textContent = progressArray.join("")
     
}

redirect = (event) => {
    event.preventDefault() 
    // Clear form before redirecting 
    event.target.reset()
    window.location = "submitted.html"

}

addBr("checkbox")
addBr("radio")
// After submit redirect page to thank you and links to further reading

let form = document.querySelector("#survey-form")
form.addEventListener("submit",redirect)

// show other linked input textbox only when other is selected

let diet = document.querySelector("#dropdown")
diet.addEventListener("change",(event) => toggleOther(event))

let reason = document.querySelector("#reason")
//If required this is how it can be called, however making value of an equal to id of other was simpler
//reason.addEventListener("change",(event) => toggleOther(reason.id,event.target.value))
reason.addEventListener("change",(event) => toggleOther(event,reason.checked))

//Validation: if all of the above is checked, make all the checkboxes checked and if none of the above
//is checked uncheck all
document.querySelector("#none").addEventListener("change",() => {event.target.checked && setEffects(false)})
document.querySelector("#all").addEventListener("change",() => {event.target.checked && setEffects(true)})
for (effect of document.querySelectorAll('input[name="effect"]'))
{
    effect.addEventListener("change",() => {
    if(event.target.checked && event.target.id !== "none") {
        document.querySelector("#none").checked = false
    }
})
}

document.addEventListener("input",showProgress)




