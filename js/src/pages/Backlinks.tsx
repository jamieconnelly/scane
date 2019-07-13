import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Form, Field, FieldRenderProps } from 'react-final-form'
import { FORM_ERROR } from 'final-form'

import uploadBacklinkFiles, { IUploadables } from 'scane/mutations/uploadBacklinkFiles'

import styles from './Backlinks.scss'

interface IFormValues {
  files: File[]
}

const FileInput = ({
  input: { onChange },
}: FieldRenderProps<string, HTMLInputElement>) => (
  <Dropzone onDrop={(files) => onChange(files)}>
    {({ getRootProps, getInputProps, isDragActive }) => (
      <section>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
      </section>
    )}
  </Dropzone>
)

const Backlinks = () => {
  const [sucessMessage, setSucessMessage] = useState()

  const onSubmit = async (values: IFormValues) => {
    try {
      let files: IUploadables = {}
      Array.from(values.files).forEach((file, idx) => {
        files[`file-${idx}`] = file
      })
      await uploadBacklinkFiles(files)
      setSucessMessage(
        'We are now fetching the backlinks. You will receive an email with the results shortly.',
      )
    } catch (e) {
      return { [FORM_ERROR]: `Upload failed: ${e.message}` }
    }
  }

  return (
    <div className={styles.container}>
      {sucessMessage}
      <Form
        onSubmit={onSubmit}
        render={({ form, handleSubmit, submitting, pristine, values, submitError }) => (
          <form
            onSubmit={async (evt) => {
              await handleSubmit(evt)
              form.reset()
            }}
            className={styles.loginForm}
          >
            <div className={styles.labelWithInput}>
              <h3>Select one or more files</h3>
              <Field name="files" component={FileInput} />
            </div>
            <div>
              {values.files && values.files.map((f) => <p key={f.name}>{f.name}</p>)}
            </div>
            <div>
              <button type="submit" disabled={submitting || pristine || !values.files}>
                Upload files
              </button>
              <button onClick={form.reset} disabled={!values.files}>
                Remove files
              </button>
            </div>
            {submitError && <div className={styles.error}>{submitError}</div>}
          </form>
        )}
      />
    </div>
  )
}

export default Backlinks
