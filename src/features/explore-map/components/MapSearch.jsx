import { Autocomplete, Box, InputAdornment, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { PLACE_TYPE_LABELS } from '../config'
import { formatShare } from '../format'

/**
 * Autocomplete search for cities and schools.
 *
 * `value={null}` keeps the field empty after each pick so the user can
 * immediately search for a second school (for marker B).
 *
 * MUI v9 uses `slotProps` (not the older `InputProps` / `inputProps` API).
 */
export default function MapSearch({ options, onSelect }) {
  return (
    <Autocomplete
      fullWidth
      size="small"
      blurOnSelect
      options={options}
      value={null}
      // Groups need options pre-sorted by type (see buildSearchablePlaces).
      groupBy={(place) => PLACE_TYPE_LABELS[place.type]}
      getOptionLabel={(place) => place.name}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      noOptionsText="No matching cities"
      onChange={(_event, place) => {
        if (place) onSelect(place)
      }}
      renderOption={(props, place) => {
        const { key, ...optionProps } = props
        const secondary =
          place.type === 'school' && place.frpmEligibleShare != null
            ? `${place.detail} · FRPM ${formatShare(place.frpmEligibleShare)}`
            : place.detail

        return (
          <Box component="li" key={key} {...optionProps}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2">{place.name}</Typography>
              {secondary && (
                <Typography variant="caption" color="text.secondary">
                  {secondary}
                </Typography>
              )}
            </Box>
          </Box>
        )
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          type="search"
          placeholder="Search a city"
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    {/* Decorative icon — label is on the input itself. */}
                    <SearchIcon fontSize="small" aria-hidden="true" />
                  </InputAdornment>
                  {params.slotProps.input.startAdornment}
                </>
              ),
            },
            htmlInput: {
              ...params.slotProps.htmlInput,
              'aria-label': 'Search for a city',
            },
          }}
        />
      )}
    />
  )
}
