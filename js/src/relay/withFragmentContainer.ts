import { createFragmentContainer } from 'react-relay'

export default <T>(options: any) => (Component: React.ComponentType<T>) =>
  createFragmentContainer<T>(Component, options)
