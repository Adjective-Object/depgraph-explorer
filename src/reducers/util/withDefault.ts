export function withDefault<TState, TAction>(
    reducer: (state: TState, action: TAction) => TState,
    initialState: TState,
): (state: TState | undefined, action: TAction) => TState {
    return (
        state: TState | undefined,
        action: TAction
    ): TState => reducer(
        state ?? initialState,
        action,
    )
}