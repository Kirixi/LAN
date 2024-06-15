import { FormControl, FormErrorMessage, FormLabel, Input} from '@chakra-ui/react';
import { Field, useField } from 'formik';

// Referenced from https://www.youtube.com/watch?v=4j6QiEbBoS0

//Renders form fields using Formik with Chakra UI
function FormField({label, ...props}) {
    const [field, meta] = useField(props)
    return ( 
        <FormControl isInvalid={meta.error && meta.touched} isRequired>
            <FormLabel>{label}</FormLabel>
            <Field
                as={Input}
                {...field}
                {...props}
                />
            <FormErrorMessage>{meta.error}</FormErrorMessage>       
        </FormControl>
     );
}

export default FormField;