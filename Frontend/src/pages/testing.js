import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


import { Field, Formik, Form } from "formik";
import { FormControl, FormErrorMessage, Button } from "@chakra-ui/react";
function Testing() {
  function validateName(value) {
    let error;
    if (!value) {
      error = "Name is required";
    } else if (value.toLowerCase() !== "naruto") {
      error = "Jeez! You're not a fan 😱";
    }
    return error;
  }

  return (
    <Formik
      initialValues={{ name: "" }}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }, 1000);
      }}
    >
      {(props) => (
        <Form>
          <Field name="name" validate={validateName}>
            {({ field, form }) => (
              <FormControl isInvalid={form.errors.txt}>
                <ReactQuill
                  placeholder="What's on your mind?"
                  theme="snow"
                  name="txt"
                  value={field.values}
                  onChange={field.onChange(field.name)}
                />
                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={props.isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
}
export default Testing;
