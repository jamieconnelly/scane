import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Form, Field, FieldRenderProps } from 'react-final-form'
import { FORM_ERROR } from 'final-form'

import Button from 'scane/components/Button'
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
        <div {...getRootProps()} className={styles.dropzone}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
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
      <Form
        onSubmit={onSubmit}
        render={({ form, handleSubmit, submitting, pristine, values, submitError }) => (
          <form
            onSubmit={async (evt) => {
              await handleSubmit(evt)
              form.reset()
            }}
          >
            {sucessMessage && <div className={styles.success}>{sucessMessage}</div>}
            <Field name="files" component={FileInput} />
            <div className={styles.fileNames}>
              {values.files && values.files.map((f) => <p key={f.name}>{f.name}</p>)}
            </div>
            <div className={styles.buttons}>
              <Button type="submit" disabled={submitting || pristine || !values.files}>
                Upload files
              </Button>
              <Button onClick={form.reset} disabled={!values.files}>
                Remove files
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
