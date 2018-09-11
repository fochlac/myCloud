import PropTypes from 'prop-types'
import ImmuTypes from 'immutable-prop-types'

export const AccessTokenType = ImmuTypes.shape({
  url: PropTypes.string.isRequired,
  gallery: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  access: PropTypes.string.isRequired,
  recursive: PropTypes.bool.isRequired,
})

export const ImageType = ImmuTypes.shape({
  id: PropTypes.string.isRequired,
  gallery: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
})

export const GalleryType = ImmuTypes.shape({
  id: PropTypes.string.isRequired,
  accessToken: AccessTokenType.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  parent: PropTypes.string.isRequired,
  images: ImmuTypes.listOf(ImageType).isRequired,
  urls: ImmuTypes.listOf(AccessTokenType).isRequired,
  ancestors: ImmuTypes.listOf(PropTypes.string).isRequired,
  children: ImmuTypes.listOf(PropTypes.string).isRequired,
})
