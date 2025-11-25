package jwt

import (
	"crypto/sha256"
	"encoding/hex"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

type Claims struct {
	AdminId uint `json:"user_id"`
	jwt.RegisteredClaims
}

func GenerateToken(adminId uint, duration uint16) (string, string, string, error) {
	jti := uuid.NewString()

	claims := Claims{
		AdminId: adminId,
		RegisteredClaims: jwt.RegisteredClaims{
			ID:       jti,
			IssuedAt: jwt.NewNumericDate(time.Now()),
			Issuer:   "gin-demo",
		},
	}

	if duration > 0 {
		claims.ExpiresAt = jwt.NewNumericDate(time.Now().Add(time.Duration(duration) * time.Minute))
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", "", "", err
	}

	hash := sha256.Sum256([]byte(signedToken))
	hashToken := hex.EncodeToString(hash[:])

	return signedToken, hashToken, jti, nil
}

func ParseToken(tokenStr string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, err
}
