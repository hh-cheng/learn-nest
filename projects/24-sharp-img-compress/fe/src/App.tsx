import { message, Upload } from 'antd'
import { InboxOutlined } from '@ant-design/icons'

const { Dragger } = Upload

export default function App() {
  return (
    <Dragger
      name="file"
      action="http://localhost:3000/upload"
      onChange={(info) => {
        const { status } = info.file
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`)
        } else {
          message.error(`${info.file.name} file upload failed`)
        }
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">click or drag a file here to upload</p>
    </Dragger>
  )
}
