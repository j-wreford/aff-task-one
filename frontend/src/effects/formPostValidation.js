// react
import React from 'react'

/**
 * Abstracts form validation away from the component hosting the form.
 * 
 * For each field name within the array passed as the fields parameter, a
 * react state will be made for it. This state takes the following form:
 * 
 * {
 *     error: Boolean
 *     helperText: String
 * }
 * 
 * Whenever one of these field states is set through a call to setValidation(),
 * the validation state property is regenerated for the client component.
 */
export default fields => {

    /**
     * The validation object itself.
     * 
     * This state is regenerated whenever a field state mutates.
     */
    const [validation, setValidation] = React.useState(
        fields.reduce((o, key) =>
                ({...o, [key]: { error: false, helperText: ""}}), {}
        )
    )

    /**
     * Contains state for each field
     */
    const fieldStates = {}

    /**
     * Construct fieldStates and set the initial value of the validation object
     */
    fields.map(field => {
        const [value, setValue] = React.useState({
            error: false,
            helperText: ""
        })
        fieldStates[field] = {
            value: value,
            setValue: setValue
        }  
    })

    /**
     * Reconstructs the validation object when any field validation state mutates
     */
    React.useEffect(() => {

        let v = {}

        for (const [fieldName, fieldState] of Object.entries(fieldStates))
            v[fieldName] = fieldState.value

        setValidation(v)

        
    }, Object.entries(fieldStates).map(field => field[1].value))

    /**
     * Sets state for the given field's validation
     */
    const setFieldValidation = (field, error, helperText) => {

        console.log(`formPostValidation.js: Updating validation state for field ${field}.`)

        if (fieldStates.hasOwnProperty(field)) {

            fieldStates[field].setValue({
                error: error,
                helperText: helperText
            })
        }
    }

    return [validation, setFieldValidation]
}