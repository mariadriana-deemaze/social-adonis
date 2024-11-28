import React, { Reducer, useEffect, useMemo, useReducer, useRef } from 'react'
import { Textarea, TextareaProps } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'

interface SlottableItemProps<T> {
  item: T
  searchTerm: string
  select: (item: T) => void
}

interface HighlightedInputProps<T> extends TextareaProps {
  /**
   * Define the trigger that will run on the parser
   */
  captureTrigger: RegExp

  /**
   * Define the callback that will run as parser against the defined trigger capture group regex
   * @param content - The controlled input content value.
   * @param selection - The selected elements list.
   */
  parser: (content: string, selection: T[]) => string

  /**
   * Define a key in T, to act as a matching predicate.
   */
  matcherPredicate: keyof T

  /**
   *
   * @param searchTerm  - The query param term for the next batch of list items.
   */
  fetcher: (searchTerm: string) => Promise<T[]>

  /**
   * Default text to highlight upon initialization.
   */
  defaultHightlights: T[]

  /**
   * React component to render as a slottable list option item.
   *
   * @property {T} item - Receives a generic <T>.
   * @property {string} searchTerm - The current search string.
   * @property {function} select - The select option triger.
   */
  Item: ({ item, searchTerm, select }: SlottableItemProps<T>) => React.ReactNode
}

export enum ReducerActionType {
  OPEN_LIST = 'OPEN_LIST',
  CLOSE_LIST = 'CLOSE_LIST',
  UPDATE_LIST = 'UPDATE_LIST',
  ADD_SELECTED = 'ADD_SELECTED',
  UPDATE_SEARCH_TERM = 'UPDATE_SEARCH_TERM',
  CLEAR_SEARCH_TERM = 'CLEAR_SEARCH_TERM',
  RECYCLE_SELECT_MATCHES = 'RECYCLE_SELECT_MATCHES',
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
  | {
      type: ReducerActionType.RECYCLE_SELECT_MATCHES
      state: {
        value: string
      }
    }

export default function HighlightedInput<T>({
  Item,
  captureTrigger,
  parser,
  fetcher,
  matcherPredicate,
  defaultHightlights,
  ...rest
}: HighlightedInputProps<T>) {
  const initialState: ReducerContextState<T> = {
    list: [],
    open: false,
    selected: defaultHightlights ?? [],
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

      case ReducerActionType.UPDATE_SEARCH_TERM: {
        current.searchTerm = action.state.searchTerm
        return current
      }

      case ReducerActionType.CLEAR_SEARCH_TERM: {
        current.searchTerm = ''
        return current
      }

      case ReducerActionType.ADD_SELECTED: {
        current.selected = [...current.selected, action.state.selected]
        current.open = false
        return current
      }

      case ReducerActionType.RECYCLE_SELECT_MATCHES: {
        const matches = action.state.value.match(captureTrigger)?.map((m) => m.replace('@', ''))
        current.selected = current.selected.filter((item) =>
          matches?.includes(item[matcherPredicate as keyof T] as string)
        )
        return current
      }

      default:
        return current
    }
  }, initialState)

  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const highlighterRef = useRef<HTMLDivElement>(null)

  function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const matches = e.target.value.match(captureTrigger)
    const isCapturing = matches ? matches?.length > state.selected.length : false

    if (isCapturing && !state.open) {
      dispatch({ type: ReducerActionType.OPEN_LIST })
    } else if (!isCapturing && state.open) {
      dispatch({ type: ReducerActionType.CLOSE_LIST })
    }

    if (matches?.length && matches[matches.length - 1]) {
      dispatch({
        type: ReducerActionType.UPDATE_SEARCH_TERM,
        state: {
          searchTerm: matches[matches.length - 1].replace('@', ''),
        },
      })
    } else {
      dispatch({
        type: ReducerActionType.CLEAR_SEARCH_TERM,
      })
    }

    dispatch({
      type: ReducerActionType.RECYCLE_SELECT_MATCHES,
      state: {
        value: e.target.value,
      },
    })

    if (rest?.onChange) rest?.onChange(e)
  }

  async function syncScroll({ currentTarget }: React.UIEvent<HTMLTextAreaElement, UIEvent>) {
    if (highlighterRef?.current) {
      highlighterRef.current.scrollTop = currentTarget.scrollTop
    }
  }

  async function handleSelect(item: T) {
    dispatch({ type: ReducerActionType.ADD_SELECTED, state: { selected: item } })
  }

  // TODO: Move to reducer, and debounce.
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
    let content = String(rest.value)
    if (parser) content = parser(content, state.selected)
    return content
  }, [rest.value])

  useEffect(() => {
    if (state.open) fetchMore()
  }, [state.open, state.searchTerm])

  return (
    <div className="relative w-full">
      <div
        ref={highlighterRef}
        className="absolute overflow-y-scroll w-full h-full py-[0.56rem] px-[0.81rem] whitespace-pre-wrap break-words text-transparent pointer-events-none z-0 bg-blend-color"
      >
        <p
          className="text-sm"
          dangerouslySetInnerHTML={{
            __html: highlightedContent,
          }}
        />
      </div>
      <Textarea
        ref={textAreaRef}
        className="no-scrollbar z-10"
        {...rest}
        onScroll={syncScroll}
        onChange={onChange}
      />
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
