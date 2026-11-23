import { Autocomplete, Box, InputAdornment, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { PLACE_TYPE_LABELS } from '../config'
import { formatShare } from '../format'

/** Search cities or schools; schools show FRPM in the dropdown. */
export default function MapSearch({ options, onSelect }) {
  return (
    <Autocomplete
      fullWidth
      size="small"
      blurOnSelect
      options={options}
      value={null}
      groupBy={(place) => PLACE_TYPE_LABELS[place.type]}
      getOptionLabel={(place) => place.name}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      noOptionsText="No matching schools or cities"
      filterOptions={(options, { inputValue }) => {
        const query = inputValue.trim().toLowerCase()
        const pool = query.length < 2
          ? options.filter((place) => place.type === 'city')
          : options.filter((place) => place.name.toLowerCase().includes(query))
        return pool
          .slice()
          .sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name))
          .slice(0, 40)
      }}
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
          placeholder="Search a school or city"
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" aria-hidden="true" />
                  </InputAdornment>
                  {params.slotProps.input.startAdornment}
                </>
              ),
            },
            htmlInput: {
              ...params.slotProps.htmlInput,
              'aria-label': 'Search for a school or city',
            },
          }}
        />
      )}
    />
  )
}
