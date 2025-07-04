/*
 * KIELER - Kiel Integrated Environment for Layout Eclipse RichClient
 *
 * http://rtsys.informatik.uni-kiel.de/kieler
 *
 * Copyright 2021-2025 by
 * + Kiel University
 *   + Department of Computer Science
 *     + Real-Time and Embedded Systems Group
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0
 */

import { inject, injectable, postConstruct } from 'inversify'
import { ICommand } from 'sprotty'
import { Action, UpdateModelAction } from 'sprotty-protocol'
import { Registry } from '../base/registry'
import { PersistenceStorage, ServiceTypes } from '../services'
import { ResetRenderOptionsAction, SetRenderOptionAction } from './actions'
import { RangeOption, RenderOption, TransformationOptionType } from './option-models'

/**
 * Whether the sidebar panel is pinned or not.
 */
export class PinSidebarOption implements RenderOption {
    static readonly ID: string = 'pin-sidebar'

    static readonly NAME: string = 'Pin Sidebar'

    static readonly DEFAULT: boolean = true

    readonly id: string = PinSidebarOption.ID

    readonly name: string = PinSidebarOption.NAME

    readonly type: TransformationOptionType = TransformationOptionType.CHECK

    readonly initialValue: boolean = PinSidebarOption.DEFAULT

    currentValue = PinSidebarOption.DEFAULT

    debug = true
}

/**
 * Resize the diagram to fit the viewport if it is redrawn after a model update
 * or a viewport resize.
 * This has to have the same id as the corresponding FitToScreenAction.
 */
export class ResizeToFit implements RenderOption {
    static readonly ID: string = 'fit'

    static readonly NAME: string = 'Resize To Fit on Refresh'

    static readonly DEFAULT: boolean = true

    readonly id: string = ResizeToFit.ID

    readonly name: string = ResizeToFit.NAME

    // readonly tooltip: string = ResizeToFit.TOOLTIP;
    readonly type: TransformationOptionType = TransformationOptionType.CHECK

    readonly initialValue: boolean = ResizeToFit.DEFAULT

    readonly description = 'Always resize to fit after diagram refresh.'

    currentValue = ResizeToFit.DEFAULT

    debug = true
}

export class ShowConstraintOption implements RenderOption {
    static readonly ID: string = 'show-constraints'

    static readonly NAME: string = 'Show Constraint'

    readonly id: string = ShowConstraintOption.ID

    readonly name: string = ShowConstraintOption.NAME

    readonly type: TransformationOptionType = TransformationOptionType.CHECK

    readonly initialValue: boolean = false

    readonly renderCategory: string = Appearance.ID

    readonly description = 'Show marker for nodes that have interactive layout constraints set.'

    currentValue = false
}

export class Appearance implements RenderOption {
    static readonly ID: string = 'appearance'

    static readonly NAME: string = 'Appearance'

    readonly id: string = Appearance.ID

    readonly name: string = Appearance.NAME

    readonly type: TransformationOptionType = TransformationOptionType.CATEGORY

    readonly initialValue: boolean = true

    readonly description = 'Appearance Category'

    currentValue = true
}

/**
 * Smart Zoom category.
 */
export class SmartZoom implements RenderOption {
    static readonly ID: string = 'smart-zoom'

    static readonly NAME: string = 'Smart Zoom'

    readonly id: string = SmartZoom.ID

    readonly name: string = SmartZoom.NAME

    readonly type: TransformationOptionType = TransformationOptionType.CATEGORY

    readonly initialValue: boolean = true

    readonly renderCategory: string = Appearance.ID

    readonly description = 'Smart Zoom Category'

    currentValue = true

    debug = true
}

/**
 * Boolean option to enable and disable the smart zoom feature.
 * This corresponds to the automatic detail level of regions and states
 * as well as limiting visible elements.
 */
export class UseSmartZoom implements RenderOption {
    static readonly ID: string = 'use-smart-zoom'

    static readonly NAME: string = 'Smart Zoom'

    static readonly DEFAULT: boolean = true

    readonly id: string = UseSmartZoom.ID

    readonly name: string = UseSmartZoom.NAME

    readonly type: TransformationOptionType = TransformationOptionType.CHECK

    readonly initialValue: boolean = true

    readonly renderCategory: string = Appearance.ID

    readonly description = 'Enables Smart Zoom'

    currentValue = true
}

/**
 * Threshold for full detail level.
 * Corresponds to the regions size compared to the current viewport.
 */
export class FullDetailRelativeThreshold implements RangeOption {
    static readonly ID: string = 'full-detail-relative-threshold'

    static readonly NAME: string = 'Full Detail Relative Threshold'

    static readonly DEFAULT: number = 0.15

    readonly id: string = FullDetailRelativeThreshold.ID

    readonly name: string = FullDetailRelativeThreshold.NAME

    readonly type: TransformationOptionType = TransformationOptionType.RANGE

    readonly values: any[] = []

    readonly range = {
        first: 0.01,
        second: 1,
    }

    readonly stepSize = 0.01

    readonly initialValue: number = FullDetailRelativeThreshold.DEFAULT

    readonly renderCategory: string = SmartZoom.ID

    readonly description =
        'Shows all children of an element that uses at least the amount of the canvas.' +
        'A value of 0.2 means an element is shown if its parent has at least 0.2 the size (maximum of width and height) of the canvas.'

    currentValue = 0.2

    debug = true
}

/**
 * Threshold for full detail level.
 * Corresponds to the regions scale using the current viewport.
 */
export class FullDetailScaleThreshold implements RangeOption {
    static readonly ID: string = 'full-detail-scale-threshold'

    static readonly NAME: string = 'Full Detail Scale Threshold'

    static readonly DEFAULT: number = 0.25

    readonly id: string = FullDetailScaleThreshold.ID

    readonly name: string = FullDetailScaleThreshold.NAME

    readonly type: TransformationOptionType = TransformationOptionType.RANGE

    readonly values: any[] = []

    readonly range = {
        first: 0.01,
        second: 1,
    }

    readonly stepSize = 0.01

    readonly initialValue: number = FullDetailScaleThreshold.DEFAULT

    readonly renderCategory: string = SmartZoom.ID

    readonly description =
        'Show an element if it can be rendered in at least the given amount of it original size.' +
        'A value of 0.25 means an element is shown if it can be drawn in a fourth of its original height or width.'

    currentValue = 0.25

    debug = true
}

/**
 * Boolean option toggling the use of text element replacement with rectangles.
 */
export class SimplifySmallText implements RenderOption {
    static readonly ID: string = 'simplify-small-text'

    static readonly NAME: string = 'Simplify Small Text'

    readonly id: string = SimplifySmallText.ID

    readonly name: string = SimplifySmallText.NAME

    readonly type: TransformationOptionType = TransformationOptionType.CHECK

    readonly initialValue: boolean = true

    readonly renderCategory: string = SmartZoom.ID

    readonly description = 'Whether illegible text is simplified to colored rectangles.'

    currentValue = true

    debug = true
}

/**
 * Threshold under which text element simplification occurs in pixels.
 */
export class TextSimplificationThreshold implements RangeOption {
    static readonly ID: string = 'text-simplification-threshold'

    static readonly NAME: string = 'Text Simplification Threshold'

    static readonly DEFAULT: number = 3.3 // This is the same time the rendering would suddenly switch to a smaller representation of the font

    readonly id: string = TextSimplificationThreshold.ID

    readonly name: string = TextSimplificationThreshold.NAME

    readonly type: TransformationOptionType = TransformationOptionType.RANGE

    readonly values: any[] = []

    readonly range = {
        first: 1,
        second: 10,
    }

    readonly stepSize = 0.1

    readonly initialValue: number = TextSimplificationThreshold.DEFAULT

    readonly renderCategory: string = SmartZoom.ID

    readonly description =
        'The threshold font size to simplify text.\nIf set to 3 a text which is 3 or less pixel high is simplified.'

    currentValue = 3.3

    debug = true
}

/**
 * The factor by which titles of collapsed regions get scaled by
 * in relation to their size at native resolution.
 */
export class TitleScalingFactor implements RangeOption {
    static readonly ID: string = 'title-scaling-factor'

    static readonly NAME: string = 'Title Scaling Factor'

    static readonly DEFAULT: number = 1

    readonly id: string = TitleScalingFactor.ID

    readonly name: string = TitleScalingFactor.NAME

    readonly type: TransformationOptionType = TransformationOptionType.RANGE

    readonly values: any[] = []

    readonly range = {
        first: 0.5,
        second: 3,
    }

    readonly stepSize = 0.01

    readonly initialValue: number = TitleScalingFactor.DEFAULT

    readonly renderCategory: string = SmartZoom.ID

    readonly description =
        'Factor to scale region titles compared to their original size.' +
        'If set to 1 a region title be its original size (if the space permits) regardless of the zoom level.' +
        'If it was 10 pixel high before it will always be 10 pixel high if the label can fit the region.'

    currentValue = 1

    debug = true
}

/**
 * Boolean option to toggle the scaling of lines based on zoom level.
 */
export class UseLineScaling implements RenderOption {
    static readonly ID: string = 'use-minimum-line-scale'

    static readonly NAME: string = 'Use Line Scaling'

    readonly id: string = UseLineScaling.ID

    readonly name: string = UseLineScaling.NAME

    readonly type: TransformationOptionType = TransformationOptionType.CHECK

    readonly initialValue: boolean = true

    readonly renderCategory: string = SmartZoom.ID

    readonly description =
        "Whether all borders and lines should be scaled to stay above a minimum threshold value set by the corresponding 'Minimum Line Scale' option."

    currentValue = true

    debug = true
}

/**
 * The minimum scale lines should have at any zoom level.
 */
export class MinimumLineScale implements RangeOption {
    static readonly ID: string = 'minimum-line-scale'

    static readonly NAME: string = 'Minimum Line Scale'

    static readonly DEFAULT: number = 1

    readonly id: string = MinimumLineScale.ID

    readonly name: string = MinimumLineScale.NAME

    readonly type: TransformationOptionType = TransformationOptionType.RANGE

    readonly values: any[] = []

    readonly range = {
        first: 0.1,
        second: 3,
    }

    readonly stepSize = 0.01

    readonly initialValue: number = 0.5

    readonly renderCategory: string = SmartZoom.ID

    readonly description =
        'The minimum line scale.\nIf set to 0.5 each line uses at least 0.5 times of its width set by the synthesis.'

    currentValue = 0.5

    debug = true
}

export enum ShadowOption {
    /** A real svg shadow. */
    PAPER_MODE = 'Paper Mode',
    /** The shape of the node drawn with different opacity multiple times behind the node. */
    KIELER_STYLE = 'KIELER Style',
}

/**
 * The style shadows should be drawn in, either the paper mode shadows (nice, but slow in
 * performance) or in default KIELER-style (fast, not as nice looking).
 */
export class Shadows implements RenderOption {
    static readonly ID: string = 'paper-shadows'

    static readonly NAME: string = 'Shadow Mode'

    static readonly DEFAULT: ShadowOption = ShadowOption.KIELER_STYLE

    readonly id: string = Shadows.ID

    readonly name: string = Shadows.NAME

    readonly type: TransformationOptionType = TransformationOptionType.CHOICE

    readonly initialValue: ShadowOption = Shadows.DEFAULT

    readonly renderCategory: string = Appearance.ID

    readonly values? = [ShadowOption.PAPER_MODE, ShadowOption.KIELER_STYLE]

    readonly description =
        'The style shadows should be drawn in, either the paper mode shadows (nice, but slow in performance)' +
        'or in default KIELER Style (fast, not as nice looking).' +
        'KIELER Style draws multiple shapes in form of the node behind the node.' +
        'Paper Mode uses SVG shadows.'

    currentValue = Shadows.DEFAULT
}

/**
 * Whether going to a Bookmark should be animated
 */
export class AnimateGoToBookmark implements RenderOption {
    static readonly ID: string = 'animate-go-to-bookmark'

    static readonly NAME: string = 'Animate Go To Bookmark'

    static readonly DEFAULT: boolean = true

    readonly id: string = AnimateGoToBookmark.ID

    readonly name: string = AnimateGoToBookmark.NAME

    readonly type: TransformationOptionType = TransformationOptionType.CHECK

    readonly initialValue: boolean = AnimateGoToBookmark.DEFAULT

    currentValue = true
}

/**
 * Boolean option to toggle debug options.
 */
export class DebugOptions implements RenderOption {
    static readonly ID: string = 'debug-options'

    static readonly NAME: string = 'Debug Options'

    readonly id: string = DebugOptions.ID

    readonly name: string = DebugOptions.NAME

    readonly type: TransformationOptionType = TransformationOptionType.CHECK

    readonly initialValue: boolean = false

    readonly description = 'Whether debug options should be shown.'

    currentValue = false
}

export interface RenderOptionType {
    readonly ID: string
    readonly NAME: string
    new (): RenderOption
}

export interface RenderOptionDefault extends RenderOptionType {
    readonly DEFAULT: any
}

/** {@link Registry} that stores and updates different render options. */
@injectable()
export class RenderOptionsRegistry extends Registry {
    private _renderOptions: Map<string, RenderOption> = new Map()

    @inject(ServiceTypes.PersistenceStorage) private storage: PersistenceStorage

    constructor() {
        super()
        // Add available render options to this registry
        // Debug
        this.register(DebugOptions)
        this.register(ResizeToFit)
        this.register(PinSidebarOption)

        this.register(AnimateGoToBookmark)

        // Appearance
        this.register(Appearance)

        this.register(ShowConstraintOption)
        this.register(Shadows)

        // Smart Zoom
        this.register(SmartZoom)

        this.register(UseSmartZoom)
        this.register(FullDetailRelativeThreshold)
        this.register(FullDetailScaleThreshold)

        this.register(SimplifySmallText)
        this.register(TextSimplificationThreshold)

        this.register(TitleScalingFactor)

        this.register(UseLineScaling)
        this.register(MinimumLineScale)
    }

    @postConstruct()
    init(): void {
        this.storage.getItem<Record<string, unknown>>('render').then((data) => {
            if (data) this.loadPersistedData(data)
        })
    }

    /**
     * Restores options that where previously persisted in storage. Since render
     * options are not provided by the server, they have to be retrieved from storage.
     */
    private loadPersistedData(data: Record<string, unknown>) {
        for (const entry of Object.entries(data)) {
            const option = this._renderOptions.get(entry[0])
            if (option) {
                // eslint-disable-next-line prefer-destructuring
                option.currentValue = entry[1]
            }
        }
        this.notifyListeners()
    }

    /** Registers a single render option. */
    register(Option: RenderOptionType): void {
        this._renderOptions.set(Option.ID, new Option())
    }

    /** Convenience method to register all given options in order. */
    registerAll(...Options: RenderOptionType[]): void {
        Options.forEach((Option) => this.register(Option))
    }

    /** Unregisters a single render option. */
    unregister(Option: RenderOptionType): boolean {
        return this._renderOptions.delete(Option.ID)
    }

    /** Convenience method to unregister all given options in order. */
    unregisterAll(...Options: RenderOptionType[]): boolean {
        return Options.every((Option) => this.unregister(Option))
    }

    /** Handles the render options actions. */
    // eslint-disable-next-line consistent-return
    handle(action: Action): void | Action | ICommand {
        if (SetRenderOptionAction.isThisAction(action)) {
            const option = this._renderOptions.get(action.id)
            if (option) {
                option.currentValue = action.value
                this.notifyListeners()
            }
        } else if (ResetRenderOptionsAction.isThisAction(action)) {
            this._renderOptions.forEach((option) => {
                option.currentValue = option.initialValue
            })
            this.notifyListeners()
        } else {
            return UpdateModelAction.create([], { animate: false, cause: action })
        }
    }

    get allRenderOptions(): RenderOption[] {
        return Array.from(this._renderOptions.values())
    }

    getValue(Option: RenderOptionType): any | undefined {
        return this._renderOptions.get(Option.ID)?.currentValue
    }

    getValueOrDefault(Option: RenderOptionDefault): any {
        return this.getValue(Option) ?? Option.DEFAULT
    }
}
