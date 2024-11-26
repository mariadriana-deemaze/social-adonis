import React, { Reducer, useEffect, useMemo, useReducer } from 'react'
import { Textarea, TextareaProps } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'

interface HighlightedInputProps<T> extends TextareaProps {
  captureTrigger?: string
  parser: (selection: T[]) => string
  fetcher: (searchTerm: string) => Promise<T[]>
  Item: ({
    item,
    searchTerm,
    select,
  }: {
    item: T
    searchTerm: string
    select: (item: T) => void
  }) => React.ReactNode
}

export enum ReducerActionType {
  OPEN_LIST = 'OPEN_LIST',
  CLOSE_LIST = 'CLOSE_LIST',
  UPDATE_LIST = 'UPDATE_LIST',
  ADD_SELECTED = 'ADD_SELECTED',
  REMOVE_SELECTED = 'REMOVE_SELECTED',
  UPDATE_SEARCH_TERM = 'UPDATE_SEARCH_TERM',
  CLEAR_SEARCH_TERM = 'CLEAR_SEARCH_TERM',
}

export type ReducerContextState<T> = {
  list: T[]
  open: boolean
  selected: T[]
  searchTerm: string
}

export type ReducerContextActionOptions<T> =
  | {
      type: ReducerActionType.UPDATE_LIST
      state: { list: T[] }
    }
  | {
      type: ReducerActionType.ADD_SELECTED
      state: { selected: T }
    }
  | {
      type: ReducerActionType.REMOVE_SELECTED
      state: { selected: T }
    }
  | {
      type: ReducerActionType.OPEN_LIST
    }
  | {
      type: ReducerActionType.CLOSE_LIST
    }
  | {
      type: ReducerActionType.CLEAR_SEARCH_TERM
    }
  | {
      type: ReducerActionType.UPDATE_SEARCH_TERM
      state: {
        searchTerm: string
      }
    }

export default function HighlightedInput<T>({
  Item,
  captureTrigger = '@',
  parser,
  fetcher,
  ...rest
}: HighlightedInputProps<T>) {
  const initialState: ReducerContextState<T> = {
    list: [],
    open: false,
    selected: [],
    searchTerm: '',
  }

  const [state, dispatch] = useReducer<
    Reducer<ReducerContextState<T>, ReducerContextActionOptions<T>>
  >((current: ReducerContextState<T>, action: ReducerContextActionOptions<T>) => {
    switch (action.type) {
      case ReducerActionType.OPEN_LIST: {
        current.open = true
        return current
      }

      case ReducerActionType.CLOSE_LIST: {
        current.open = false
        return current
      }

      case ReducerActionType.UPDATE_LIST: {
        current.list = [...action.state.list]
        return current
      }

      case ReducerActionType.ADD_SELECTED: {
        current.selected = [...current.selected, action.state.selected]
        current.open = false
        return current
      }

      case ReducerActionType.UPDATE_SEARCH_TERM: {
        current.searchTerm = action.state.searchTerm
        return current
      }

      case ReducerActionType.CLEAR_SEARCH_TERM: {
        current.searchTerm = ''
        return current
      }

      case ReducerActionType.REMOVE_SELECTED: {
        current.selected = current.selected.filter((item) => item !== action.state.selected)
        current.open = false
        return current
      }

      default:
        return current
    }
  }, initialState)

  const CAPTURE_MODE = new RegExp(`(?:^|\\s)(${captureTrigger}([^ ]*))$`)

  function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const isCapturing = CAPTURE_MODE.test(e.target.value)
    const matches = e.target.value.match(CAPTURE_MODE)

    if (isCapturing && !state.open) {
      dispatch({ type: ReducerActionType.OPEN_LIST })
    } else if (!isCapturing && state.open) {
      dispatch({ type: ReducerActionType.CLOSE_LIST })
    }

    if (matches?.length && matches[matches.length - 1]) {
      dispatch({
        type: ReducerActionType.UPDATE_SEARCH_TERM,
        state: {
          searchTerm: matches[matches.length - 1],
        },
      })
    } else {
      dispatch({
        type: ReducerActionType.CLEAR_SEARCH_TERM,
      })
    }

    if (rest?.onChange) rest?.onChange(e)
  }

  async function handleSelect(item: T) {
    dispatch({ type: ReducerActionType.ADD_SELECTED, state: { selected: item } })
  }

  async function fetchMore() {
    const items = await fetcher(state.searchTerm)
    dispatch({
      type: ReducerActionType.UPDATE_LIST,
      state: {
        list: items,
      },
    })
  }

  let highlightedContent = useMemo(() => {
    let content = rest.value
    if (parser) content = parser(state.selected)
    return String(content)
  }, [state.selected])

  useEffect(() => {
    console.log('highlightedContent ->', highlightedContent)
  }, [highlightedContent])

  useEffect(() => {
    fetchMore()
  }, [state.open, state.searchTerm])

  return (
    <div>
      <div className="absolute w-full h-full py-[0.55rem] px-[0.80rem] whitespace-pre-wrap break-words text-transparent pointer-events-none z-0 bg-blend-color">
        <p
          className="text-sm"
          dangerouslySetInnerHTML={{
            __html: highlightedContent,
          }}
        />
      </div>
      <Textarea {...rest} onChange={onChange} className="no-scrollbar z-10" />
      {state.open && state.list.length > 0 && (
        <div className="relative w-full">
          <Card className="absolute top-[calc(100%_+_5px)] w-full flex flex-col gap-2 px-2 py-1 divide-y divide-dashed">
            <ul>
              {state.list.map((item: T, i: number) => (
                <li key={`random_${i}`}>
                  <Item item={item} searchTerm={state.searchTerm} select={handleSelect} />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  )
}
