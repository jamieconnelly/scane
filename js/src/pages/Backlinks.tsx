import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Form, Field, FieldRenderProps } from 'react-final-form'
import { FORM_ERROR } from 'final-form'

import Button from 'scane/components/Button'
import uploadBacklinkFiles from 'scane/mutations/uploadBacklinkFiles'

import styles from './Backlinks.scss'

interface IFormValues {
  file: File[]
}

const FileInput = ({
  input: { onChange },
}: FieldRenderProps<string, HTMLInputElement>) => (
  <Dropzone multiple={false} onDrop={(file) => onChange(file)}>
    {({ getRootProps, getInputProps, isDragActive }) => (
      <div {...getRootProps()} className={styles.dropzone}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop file here ...</p>
        ) : (
          <p>Drag 'n' Drop file here or click to select file</p>
        )}
      </div>
    )}
  </Dropzone>
)

const Backlinks = () => {
  const [sucessMessage, setSucessMessage] = useState()

  const onSubmit = async (values: IFormValues) => {
    try {
      const file = values.file[0]
      await uploadBacklinkFiles({ [file.name]: file })
      setSucessMessage(
        'We are fetching the backlinks, you will receive an email with the results shortly.',
      )
    } catch (e) {
      return { [FORM_ERROR]: `Upload failed: ${e.message}` }
    }
  }

  return (
    <div className={styles.container}>
      <Form
        onSubmit={onSubmit}
        render={({ form, handleSubmit, submitting, pristine, values, submitError }) => (
          <form
            className={styles.form}
            onSubmit={async (evt) => {
              await handleSubmit(evt)
              form.reset()
            }}
          >
            {sucessMessage && <div className={styles.success}>{sucessMessage}</div>}
            <Field name="file" component={FileInput} />
            {values.file && (
              <div className={styles.fileNames}>
                <p>{values.file[0].name}</p>
              </div>
            )}
            <div className={styles.buttons}>
              <Button type="submit" disabled={submitting || pristine || !values.file}>
                Upload file
              </Button>
              <Button onClick={form.reset} disabled={!values.file}>
                Remove file
              </Button>
            </div>
            {submitError && <div className={styles.error}>{submitError}</div>}
          </form>
        )}
      />
    </div>
  )
}

export default Backlinks
