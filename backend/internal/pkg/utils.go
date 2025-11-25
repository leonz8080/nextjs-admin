package pkg

import (
	"bytes"
	"encoding/base64"
	"image/png"
	"os"
	"strings"

	"github.com/disintegration/imaging"
)

func HasIntersection(arr1, arr2 []string) bool {
	set := make(map[string]struct{})
	for _, s := range arr1 {
		set[s] = struct{}{}
	}

	for _, s := range arr2 {
		if _, exists := set[s]; exists {
			return true
		}
	}

	return false
}

func SaveBase64Image(base64Str, filePath string) error {
	if idx := strings.Index(base64Str, ","); idx != -1 {
		base64Str = base64Str[idx+1:]
	}

	data, err := base64.StdEncoding.DecodeString(base64Str)
	if err != nil {
		return err
	}

	err = os.WriteFile(filePath, data, 0644)
	return err
}

func ConvertToPngBytes(src string) ([]byte, error) {
	img, err := imaging.Open(src)
	if err != nil {
		return nil, err
	}

	buf := new(bytes.Buffer)

	encoder := png.Encoder{
		CompressionLevel: png.BestCompression,
	}

	err = encoder.Encode(buf, img)
	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}
