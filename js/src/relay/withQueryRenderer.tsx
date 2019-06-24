import * as React from 'react'
import { QueryRenderer } from 'react-relay'
import { GraphQLTaggedNode, OperationType } from 'relay-runtime'

import environment from './environment'

interface IProps<T extends OperationType> {
  query?: GraphQLTaggedNode | null
  variables?: T['variables']
}

export interface IWrappedComponentProps {
  error?: Error | undefined
  relayError?: boolean
  relayLoading?: boolean
  relayReload?: () => void
}

export type OuterProps<T extends OperationType, OwnProps, Props = {}> = T['response'] &
  IWrappedComponentProps &
  OwnProps &
  Props

function withQueryRenderer<
  T extends OperationType,
  OwnProps extends object = {},
  Props extends object = {}
>({ query, variables }: IProps<T>) {
  return (
    WrappedComponent: React.ComponentType<
      OuterProps<T, OwnProps, Props | T['response']>
    >,
  ) =>
    function QueryRendererWrapper(instanceProps: OwnProps) {
      const render = ({
        error,
        props,
      }: {
        error: Error | null
        props: T['response'] | null
        retry: (() => void) | null
      }) => {
        if (error) {
          return (
            <WrappedComponent
              {...instanceProps}
              error={error}
              relayError
              relayLoading={false}
            />
          )
        }
        if (!props) {
          return <WrappedComponent {...instanceProps} relayLoading />
        }
        return <WrappedComponent {...props} {...instanceProps} />
      }

      return (
        <QueryRenderer
          environment={environment}
          query={query}
          variables={variables || {}}
          render={render}
        />
      )
    }
}

export default withQueryRenderer
