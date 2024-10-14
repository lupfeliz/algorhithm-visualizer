/**
 * @File        : sort.ts
 * @Author      : 정재백
 * @Since       : 2024-10-12
 * @Description : 정렬 알고리즘에 필요한 코드 정리
 * @Site        : https://devlog.ntiple.com
 **/

import type { Function0, Function1, Function2 } from "lodash"

type SortableType = {
  length: Function0<number>
  compare: Function2<number, number, number>
  swap: Function2<number, number, void>
  shift: Function2<number, number, void>
  data?: Function0<any>,
  intercept?: InterceptType
}

type ComparableType = number | string | {
  compare: Function1<ComparableType, number>
}

type InterceptType = (type: 'compare' | 'swap' | 'shift' | string, ...arg: any) => any

type SorterType = (sortable: SortableType, ascending: boolean) => any

class SortableArray<T extends ComparableType> implements SortableType {

  private _data: Array<T> = undefined as any as Array<T>

  private _intercept: InterceptType = undefined as any as InterceptType

  constructor(data: Array<T>, intercept?: InterceptType) {
    this._data = data
    if (intercept) { this._intercept = intercept }
  }

  length() { return this._data.length }

  compare(inx1: number, inx2: number) {
    let v1 = this._data[inx1]
    let v2 = this._data[inx2]
    if (this._intercept) { this._intercept('compare', inx1, inx2) }
    if (v1 == v2 && (v1 === undefined || v1 === null)) { return 0 }
    if (v1 === undefined || v1 === null) { return -1 }
    if (v2 === undefined || v2 === null) { return 1 }
    if (typeof v1 !== typeof v2) { return -1 }
    switch (typeof v1) {
    case 'number': {
      if (v1 === v2) {
        return 0
      } else if (Number(v1) > Number(v2)) {
        return 1
      } else {
        return -1
      }
    } break
    case 'string': {
      if (v1 === v2) {
        return 0
      } else if (String(v1) > String(v2)) {
        return 1
      } else {
        return -1
      }
    } break
    default: {
      console.log('V1:', v1)
      return v1.compare(v2)
    } }
    return 0
  }

  swap(inx1: number, inx2: number) {
    if (this._intercept) { this._intercept('swap', inx1, inx2) }
    if (inx1 >= 0 && inx2 >= 0 && inx1 < this.length() && inx2 < this.length()) {
      const v = this._data[inx1]
      this._data[inx1] = this._data[inx2]
      this._data[inx2] = v
    }
  }

  shift(inx: number, length: number) {
    if (this._intercept) { this._intercept('shift', inx, length) }
    if (inx >= 0 && length >= 0 && (inx + length) < this.length()) {
      const v = this._data[inx]
      this._data.splice(inx, 1)
      this._data.splice(inx + length, 0, v)
    }
  }

  data() { return this._data }

  intercept(type: string, ...arg: any) {
    if (this._intercept) { this._intercept(type, ...arg) }
  }
}

/** 버블정렬 */
const bubblesort: SorterType = (sortable: SortableType, ascending: boolean = true) => {
  if (sortable.intercept) { sortable.intercept('start') }
  let len = sortable.length()
  let complete
  do {
    complete = true
    len -= 1
    for (let inx = 0; inx < len; inx++) {
      let comp = sortable.compare(inx, inx + 1)
      if ((ascending && comp > 0) || (!ascending && comp < 0)) {
        sortable.swap(inx, inx + 1)
        complete = false
      }
    }
    if (sortable.intercept) { sortable.intercept('complete', complete) }
  } while (!complete)
}

/** 선택정렬 */
const selectionsort: SorterType = (sortable: SortableType, ascending: boolean = true) => {
  if (sortable.intercept) { sortable.intercept('start') }
  let len = sortable.length()
  let end = len - 1
  for (let inx1 = 0; inx1 < end; inx1++) {
    for (let inx2 = inx1 + 1; inx2 < len; inx2++) {
      let comp = sortable.compare(inx1, inx2)
      if ((ascending && comp > 0) || (!ascending && comp < 0)) {
        sortable.swap(inx1, inx2)
      }
    }
  }
  if (sortable.intercept) { sortable.intercept('complete') }
}

/** 두방향 선택정렬 */
const selectionsort2: SorterType = (sortable: SortableType, ascending: boolean = true) => {
  if (sortable.intercept) { sortable.intercept('start') }
  let len = sortable.length()
  let end = len - 1
  let inx1 = 0
  let inx2 = 0
  let flag = 0
  for (inx1 = 0; inx1 < end; flag++) {
    if (flag % 2 == 0) {
      /** 정방향 */
      for (inx2 = inx1 + 1; inx2 < len; inx2++) {
        let comp = sortable.compare(inx1, inx2)
        if ((ascending && comp > 0) || (!ascending && comp < 0)) {
          sortable.swap(inx1, inx2)
        }
      }
      inx1 += 1
    } else {
      /** 역방향 */
      for (inx2 = inx1; inx2 < end; inx2++) {
        let comp = sortable.compare(inx2, end)
        if ((ascending && comp > 0) || (!ascending && comp < 0)) {
          sortable.swap(inx2, end)
        }
      }
      len -= 1
      end -= 1
    }
  }
  if (sortable.intercept) { sortable.intercept('complete') }
}

/** 퀵정렬 */
const quicksort: SorterType = (sortable: SortableType, ascending: boolean = true) => {
  const _quicksort = (sortable: SortableType, left: number, right: number, ascending: boolean) => {
    // if (sortable.intercept) { sortable.intercept('call', left, right) }
    let diff = right - left
    let comp
    if (diff == 1) {
      comp = sortable.compare(left, right)
      if ((ascending && comp > 0) || (!ascending && comp < 0)) {
        sortable.swap(left, right)
      }
    } else if (diff > 1) {
      let linx = left
      let rinx = right
      let pivot = (left + right) >> 1
      LOOP1: do {
        LOOP2: do {
          comp = sortable.compare(linx, pivot);
          if ((ascending && comp < 0) || (!ascending && comp > 0)) {
            linx += 1
          } else {
            break LOOP2
          }
        } while(true)
        LOOP3: do {
          comp = sortable.compare(rinx, pivot)
          if ((ascending && comp > 0) || (!ascending && comp < 0)) {
            rinx -= 1
          } else {
            break LOOP3
          }
        } while(true)
        if (linx <= rinx) {
          if (linx != rinx) {
            if (linx == pivot) {
              pivot = rinx
            } else if (rinx == pivot) {
              pivot = linx
            }
            sortable.swap(linx, rinx)
          }
          linx += 1
          rinx -= 1
        }
        if (linx > rinx) { break LOOP1 }
      } while(true)
      if (left < rinx) { _quicksort(sortable, left, rinx, ascending) }
      if (linx < right) { _quicksort(sortable, linx, right, ascending) }
    }
    // if (sortable.intercept) { sortable.intercept('return', left, right) }
  }
  let len = sortable.length()
  if (sortable.intercept) { sortable.intercept('start') }
  _quicksort(sortable, 0, len - 1, ascending)
  if (sortable.intercept) { sortable.intercept('complete') }
}

const heapsort: SorterType = (sortable: SortableType, ascending: boolean = true) => {

  const _make_heap = (sortable: SortableType, top: number, size: number, ascending: boolean) => {
    let pos = size >> 1
    /** make heap tree from base of the tree */
    for (let inx = pos; inx >= top + 1; inx--) {
      _heapify(sortable, inx, pos, size, ascending)
    }
  }

  const _heapify = (sortable: SortableType, inx: number, pos: number, size: number, ascending: boolean) => {
    pos = pos + 1
    let is_bin = false
    let child: number
    let comp: number
    while (inx < pos) {
      let parent = inx - 1
      /** top * 2 */
      let child1 = (inx << 1) - 1
      /** top * 2 + 1 */
      let child2 = child1 + 1
      if (child2 < size) {
        comp = sortable.compare(child1, child2)
        if ((ascending && comp > 0) || (!ascending && comp < 0)) {
          child = child1
        } else {
          child = child2
        }
      } else {
        child = child1
      }
      comp = sortable.compare(parent, child)

      if ((ascending && comp < 0) || (!ascending && comp > 0)) {
        sortable.swap(parent, child)
        is_bin = true
        inx = child + 1
      } else {
        break
      }
    }
    return is_bin
  }
  {
    let pos: number
    let size = sortable.length()
    _make_heap(sortable, 0, size, ascending)
    while (size > 1) {
      /** take node on top */
      size -= 1
      pos = size >> 1
      sortable.swap(0, size)
      _heapify(sortable, 1, pos, size, ascending)
    }
  }
}

const Sorter = {
  bubblesort,
  selectionsort,
  selectionsort2,
  quicksort,
  heapsort
}

export {
  SortableArray,
  Sorter,
  type SortableType, type ComparableType, type InterceptType, type SorterType
}