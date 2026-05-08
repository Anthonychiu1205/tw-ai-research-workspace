# Interaction Reliability (v0.9)

This pass ensures users can tell whether an action worked, failed, or used fallback.

## Operation state model

- `idle`
- `running`
- `succeeded`
- `failed`
- `fallback`

## Required feedback behavior

- run action: immediate loading state
- success: completion feedback + artifact open action
- failure: safe error message + retry path
- fallback: explicit "backend unavailable, switched to mock fallback"

No user-triggered operation should silently no-op.

## Capability-aware controls

Capability matrix drives button availability:
- available in current mode
- unavailable with explicit reason
- fallback-available hint where applicable

## Artifact activation

- operation success should create artifact(s)
- active artifact should update context panel immediately
- artifact browser should show selected/opened state

## Boundaries

- mock-first default remains
- backend optional
- no broker/order execution
- no financial advice language
