import React, { useState } from 'react'

import uploadBacklinkFiles from 'scane/mutations/uploadBacklinkFiles'

import styles from './Backlinks.scss'

type FileValues = { [key: string]: File }

const Backlinks = () => {
  const [fileValues, setFileValues] = useState<null | FileValues>(null)
  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    let files: FileValues = {}
    Array.from(evt.target.files as FileList).forEach((file, idx) => {
      files[`file-${idx}`] = file
    })
    setFileValues(files)
  }

  const [inputKey, setInputKey] = useState<undefined | string>(undefined)
  const onRemoveFiles = () => {
    setFileValues(null)
    // force input to re-render clearing the input values
    setInputKey(Math.random().toString(36))
  }

  const [isSubmitting, setSubmitting] = useState(false)
  const onSubmit = async () => {
    if (fileValues) {
      setSubmitting(true)
      await uploadBacklinkFiles(fileValues)
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.labelWithInput}>
        <label htmlFor="files">Select one or more files</label>
        <input key={inputKey} name="files" onChange={onChange} multiple type="file" />
      </div>
      <div>
        <button onClick={onSubmit} disabled={!fileValues || isSubmitting}>
          Upload
        </button>
        <button onClick={onRemoveFiles} disabled={!fileValues}>
          Remove files
        </button>
      </div>
    </div>
  )
}

export default Backlinks
