# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.2.0](https://github.com/imerljak/react-cropper-2/compare/v0.1.1...v0.2.0) (2026-02-20)


### ⚠ BREAKING CHANGES

* CropperProps no longer declares its own props inline.
It now extends UseCropperOptions, which changes event handler types
(e.g. onChange is now CropperEventHandler<CropperSelectionChangeEvent>
instead of the old untyped CropperEventHandler). The duplicate
GetCroppedCanvasOptions declaration is removed in favour of the one
from useCropperAdvanced. Also wires up onTransform and exposes
getSelection/getImage via CropperRef.
* the hook now requires all three refs (canvasRef,
selectionRef, imageRef) to be attached before it considers itself
ready. Previously only canvasRef and selectionRef were required.
Users of useCropperAdvanced who render their own markup must now
also attach imageRef to the cropper-image element.

Also adds:
- onTransform callback option (CropperImageTransformEvent)
- imageRef (React.RefObject<CropperImageElement | null>)
- getImage() accessor
* removes CropperTransform, CropperEvent, and
CropperEventDetail types; replaces generic CropperEventHandler with
CropperEventHandler<T>; adds specific event types for each event
(CropperSelectionChangeEvent, CropperCanvasActionStartEvent,
CropperCanvasActionMoveEvent, CropperCanvasActionEndEvent,
CropperImageTransformEvent, CropperCanvasActionEvent); adds
CropperElement base interface and full CropperImageElement API;
updates jsx.d.ts with all missing attributes and adds cropper-shade.

* refactor!(Cropper): simplify CropperProps by extending UseCropperOptions ([4dad6ba](https://github.com/imerljak/react-cropper-2/commit/4dad6bac72f2b53c05059dc3ca9cacd5c0ca561b))


### Features

* add imageRef, onTransform event, and getImage to useCropperAdvanced ([874d0bb](https://github.com/imerljak/react-cropper-2/commit/874d0bb800bfacd94082baf501eeaeb04d709d12))
* add mappings to cropper-viewer ([7bb8cc4](https://github.com/imerljak/react-cropper-2/commit/7bb8cc4977de25eb955413795e2a3719fd501058))
* expose element accessors and grid prop in useCropper ([bdb10e0](https://github.com/imerljak/react-cropper-2/commit/bdb10e0ad8774873e6d08eee9746241b24e80c3c))
* refactor example app to be a usable playground ([b5ca102](https://github.com/imerljak/react-cropper-2/commit/b5ca102b5936a8b730ddfdaca721962a9f007717))


### Bug Fixes

* overhaul type definitions to align with CropperJS 2.x API ([eba432b](https://github.com/imerljak/react-cropper-2/commit/eba432b31911cb1466189439e9ea92ea4a1c1f80))
