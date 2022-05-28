import { observer } from "mobx-react-lite"
import { useMemo, useRef, VFC } from "react"
import { matrixFromTranslation } from "../../../helpers/matrix"
import { useStores } from "../../../hooks/useStores"
import { GLSurface } from "../../GLSurface/GLSurface"
import { Transform } from "../../GLSurface/Transform"
import { Beats } from "./Beats"
import { Cursor } from "./Cursor"
import { Lines } from "./Lines"
import { Notes } from "./Notes"
import { Selection } from "./Selection"

export interface ArrangeViewCanvasProps {
  width: number
}

export const ArrangeViewCanvas: VFC<ArrangeViewCanvasProps> = observer(
  ({ width }) => {
    const rootStore = useStores()
    const tracks = rootStore.song.tracks
    const { trackHeight, scrollLeft, scrollTop } = rootStore.arrangeViewStore
    const ref = useRef<HTMLCanvasElement>(null)

    const scrollXMatrix = useMemo(
      () => matrixFromTranslation(-scrollLeft, 0),
      [scrollLeft]
    )

    const scrollYMatrix = useMemo(
      () => matrixFromTranslation(0, -scrollTop),
      [scrollLeft, scrollTop]
    )

    const scrollXYMatrix = useMemo(
      () => matrixFromTranslation(-scrollLeft, -scrollTop),
      [scrollLeft, scrollTop]
    )

    const height = trackHeight * tracks.length

    return (
      <GLSurface
        ref={ref}
        style={{ pointerEvents: "none" }}
        width={width}
        height={height}
      >
        <Transform matrix={scrollYMatrix}>
          <Lines width={width} />
        </Transform>
        <Transform matrix={scrollXMatrix}>
          <_Beats height={height} />
          <_Cursor height={height} />
        </Transform>
        <Transform matrix={scrollXYMatrix}>
          <Notes />
          <_Selection />
        </Transform>
      </GLSurface>
    )
  }
)

const _Beats: VFC<{ height: number }> = observer(({ height }) => {
  const rootStore = useStores()
  const {
    rulerStore: { beats },
  } = rootStore.arrangeViewStore
  return <Beats height={height} beats={beats} />
})

const _Cursor: VFC<{ height: number }> = observer(({ height }) => {
  const rootStore = useStores()
  const { cursorX } = rootStore.arrangeViewStore
  return <Cursor x={cursorX} height={height} />
})

const _Selection = observer(() => {
  const rootStore = useStores()
  const { selectionRect } = rootStore.arrangeViewStore
  return <Selection rect={selectionRect} />
})
